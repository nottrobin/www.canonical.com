from django import forms

from webapp.lib import vacancies


class VacanciesFilterForm(forms.Form):
    continents = forms.MultipleChoiceField(
        label='Geographical area',
        choices=sorted(vacancies.CONTINENTS),
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
    discipline = forms.MultipleChoiceField(
        label='Discipline',
        choices=sorted(vacancies.DISCIPLINE),
        widget=forms.CheckboxSelectMultiple(),
        required=False,
    )
    job_title = forms.CharField(
        label='Job title',
        max_length=150,
        required=False,
    )
    keyword = forms.CharField(
        label='Keyword',
        max_length=150,
        required=False,
    )
