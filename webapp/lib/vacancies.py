import feedparser
from requests_futures.sessions import FuturesSession


FEED_URL = (
    'http://ldd.tbe.taleo.net/ldd03/ats/servlet/Rss?'
    'org=CANONICAL&cws=1&WebPage=SRCHR&WebVersion=0&_rss_version=2'
    '&key=notsupplied&v=1.0&nocache=1465289546530'
)

GEOGRAPHIC_AREA = {
    (('AME'), ('Africa and Middle East')),
    (('ASP'), ('Asia Pacific')),
    (('EU'), ('Europe')),
    (('LAM'), ('Latin America')),
    (('NA'), ('North America')),
}
DISCIPLINE = {
    (('operations'), ('Operations')),
    (('design'), ('Design')),
    (('sales'), ('Sales')),
    (('marketing'), ('Marketing')),
    (('engineering'), ('Engineering/Technology')),
}
LOCATION = {
    (('office'), ('Office')),
    (('home'), ('Home')),
}
CONTRACTS = {
    (('permanent'), ('Permanent')),
    (('contract'), ('Contract')),
}


# TODO: Warm up cache in deploy


def process_feed():
    # TODO: Rerun feed filtered on extra fields
    # TODO: Save to file

    session = FuturesSession(max_workers=3)
    feed_request = session.get(FEED_URL)
    feed_response = feed_request.result()
    feed = feedparser.parse(feed_response.text)

    vacancies = list()
    for entry in feed.entries:
        vacancies.append({
            'id': entry.id,
            'title': entry.title,
            'published': entry.published,
            'summary': entry.summary,
            'html_description': entry.get('taleo_html-description'),
            'department': entry.get('taleo_department'),
            'location_description': entry.get('taleo_location'),
            'city': entry.get('taleo_locationcity'),
            'country_iso': entry.get('taleo_locationcountry'),
        })

    return vacancies


def get_vacancies(
    title=None,
    keywords=None,
    contract=None,
    department=None,
    geographic_area=list(),
    location=list(),
):
    # TODO: If file exists, load it up. Otherwise process feed.

    def _filter(v):
        if title and title.lower() not in v.get('title', '').lower():
            return False

        if (
            keywords and
            any(
                word.lower() not in v.get('summary', '').lower()
                for word in keywords
            )
        ):
            return False

        if (
            contract and
            any(word not in v.get('contract', '') for word in contract)
        ):
            return False

        if (
            department and
            any(word not in v.get('department', '') for word in department)
        ):
            return False

        if (
            location and
            any(word not in v.get('location', '') for word in location)
        ):
            return False

        if (
            geographic_area and
            any(
                word not in v.get('geographic_area', '')
                for word in geographic_area
            )
        ):
            return False

        return True

    vacancies = process_feed()
    vacancies = filter(_filter, vacancies)
    return vacancies
