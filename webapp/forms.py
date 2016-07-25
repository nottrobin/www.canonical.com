from django import forms

from webapp.lib import vacancies


class VacanciesFilterForm(forms.Form):
    geographic_area = forms.MultipleChoiceField(
        label='Geographical area',
        choices=sorted(vacancies.GEOGRAPHIC_AREA),
        widget=forms.CheckboxSelectMultiple(),
        required=False,
    )
    location = forms.MultipleChoiceField(
        label='Location',
        choices=sorted(vacancies.LOCATION),
        widget=forms.CheckboxSelectMultiple(),
        required=False,
    )
    contract = forms.MultipleChoiceField(
        label='Contract type',
        choices=sorted(vacancies.CONTRACTS),
        widget=forms.CheckboxSelectMultiple(),
        required=False,
    )
    department = forms.MultipleChoiceField(
        label='Discipline',
        choices=sorted(vacancies.DISCIPLINE),
        widget=forms.CheckboxSelectMultiple(),
        required=False,
    )
    title = forms.CharField(
        label='Job title',
        max_length=150,
        required=False,
    )
    keywords = forms.CharField(
        label='Keyword',
        max_length=150,
        required=False,
    )
