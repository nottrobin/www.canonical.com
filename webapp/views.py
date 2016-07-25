"""
Django views for www.canonical.com.
"""

from django.shortcuts import render
from django.views.generic.base import TemplateView
from django_template_finder_view import TemplateFinder

from webapp.forms import VacanciesFilterForm
from webapp.lib.vacancies import get_vacancies


class CanonicalTemplateFinder(TemplateFinder):
    """
    Local customisations of the shared django_template_finder_view.
    """

    def get_context_data(self, **kwargs):
        """
        Get context data fromt the database for the given page.
        """

        # Get any existing context
        context = super(CanonicalTemplateFinder, self).get_context_data(
            **kwargs
        )

        # Add level_* context variables
        clean_path = self.request.path.strip('/')
        for index, path, in enumerate(clean_path.split('/')):
            context["level_" + str(index + 1)] = path

        return context


class VacanciesFilterView(TemplateView):
    form_class = VacanciesFilterForm
    template_name = 'careers/vacancies.html'

    def get_context_data(self, **kwargs):
        GET = self.request.GET
        request_data = {
            'title': GET.get('title'),
            'keywords': GET.get('keywords'),
            'geographic_area': GET.getlist('geographic_area'),
            'location': GET.getlist('location'),
            'contract': GET.getlist('contract'),
            'department': GET.getlist('department'),
        }

        form = VacanciesFilterForm(initial=request_data)

        vacancies = get_vacancies(**request_data)

        context = super(VacanciesFilterView, self).get_context_data(**kwargs)
        context['form'] = form
        context['vacancies'] = vacancies
        return context
