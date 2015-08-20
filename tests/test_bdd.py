# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from pytest_bdd import scenario, given, when, then
from cryptacular.bcrypt import BCRYPTPasswordManager
import journal
import os
from pyramid import testing

os.environ['TESTING'] = "True"


@scenario('features/edit.feature', 'Editing')
def test_detail():
    pass


@scenario('features/homepage.feature',
          'The Homepage lists entries for anonymous users')
def test_home_listing_as_anon():
    pass


@given('an anonymous user')
def an_anonymous_user(app):
    pass


@given('a list of 3 entries')
def create_entries(db_session):
    title_template = "Title {}"
    text_template = "Entry Text{}"
    for x in range(3):
        journal.Entry.write(
            title=title_template.format(x),
            text=text_template.format(x),
            session=db_session)
        db_session.flush()


@when('the user is on the homepage')
def go_to_homepage(homepage):
    pass


@then('they see a list of 3 entries')
def check_entry_list(homepage):
    html = homepage.html
    entries = html.find_all('article', class_='entry')
    assert len(entries) == 3


@scenario('features/homepage.feature', 'Markdown')
def test_markdown():
    pass


@given('an authorized user')
def check_authorization(homepage, request):
    manager = BCRYPTPasswordManager()
    settings = {
        'auth.username': 'admin',
        'auth.password': manager.encode('secret'),
    }
    testing.setUp(settings=settings)
    req = testing.DummyRequest()

    def cleanup():
        testing.tearDown()

    request.addfinalizer(cleanup)

    return req


@when('the user adds an entry')
def test_entry(db_session):
    entry = {'text': '#testing 123\n*italic*```print "Testing 123"'
             '```', 'title': "Title"}
    journal.Entry.write(session=db_session, **entry)
    db_session.flush()


@then('the new entry is formatted with markdown')
def test_new_entry_markdown(db_session, app):
    response = app.get('/')
    actual = response.body
    expected = '<h1>testing 123</h1>'
    italic = '<em>italic</em>'
    print actual
    assert expected in actual
    assert italic in actual


@then('the entry can be edited')
def edit_entry(db_session, app):
    instance = journal.Entry.write(session=db_session, text=u'original test',
                                   title='title')
    db_session.flush()
    journal.Entry.modify(session=db_session, text=u'edited text',
                         title='title', eid=instance.id)
    db_session.flush()
    response = app.get('/')
    actual = response.body
    expected = u"edited text"
    assert expected in actual
