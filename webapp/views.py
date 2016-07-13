"""
Django views for www.canonical.com.
"""

from django.shortcuts import render
from django.views.generic.edit import FormView
from django_template_finder_view import TemplateFinder

from webapp.forms import VacanciesFilterForm

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


class VacanciesFilterView(FormView):
    form_class = VacanciesFilterForm
    template_name = 'careers/vacancies.html'

    def form_valid(self, form):
        return render(
            self.request, self.template_name, self.get_context_data()
        )

    def get(self, request, *args, **kwargs):
        self.form = self.form_class(initial=request.GET)
        return render(request, self.template_name, self.get_context_data())
