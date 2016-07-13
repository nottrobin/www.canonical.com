from django.conf.urls import url
from django_json_redirects import load_redirects
from .views import CanonicalTemplateFinder
from .views import VacanciesFilterView

urlpatterns = load_redirects() + [
    url(
        r'^careers/vacancies$',
        VacanciesFilterView.as_view(),
        name='vacancies'
    ),
    url(r'^(?P<template>.*)/?$', CanonicalTemplateFinder.as_view())
]
