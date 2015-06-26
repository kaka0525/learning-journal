# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from sqlalchemy.orm import scoped_session, sessionmaker
from zope.sqlalchemy import ZopeTransactionExtension
import os
from pyramid.config import Configurator
from pyramid.view import view_config
from waitress import serve
import sqlalchemy as sa
from sqlalchemy.ext.declarative import declarative_base
import datetime

DBSession = scoped_session(sessionmaker(extension=ZopeTransactionExtension()))
Base = declarative_base()


class Entry(Base):
    __tablename__ = 'entries'
    id = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    title = sa.Column(sa.Unicode(127), nullable=False)
    text = sa.Column(sa.UnicodeText, nullable=False)
    timestamp = sa.Column(
        sa.DateTime, nullable=False, default=datetime.datetime.utcnow
    )

    @classmethod
    def write(cls, title=None, text=None, session=None):
        if session is None:
            session = DBSession
        instance = cls(title=title, text=text)
        session.add(instance)
        return instance

    @classmethod
    def all(cls, session=None):
        if session is None:
            session = DBSession
        return session.query(cls).order_by(cls.timestamp.desc()).all()

DATABASE_URL = os.environ.get(
    'DATABASE_URL',
    'postgresql://karenwong@localhost:5432/learning-journal'
)


def init_db():
    engine = sa.create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)


@view_config(route_name='home', renderer='templates/list.jinja2')
def list_view(request):
    entries = Entry.all()
    return {'entries': entries}


def main():
    """Create a configured wsgi app"""
    settings = {}
    debug = os.environ.get('DEBUG', True)
    settings['reload_all'] = debug
    settings['debug_all'] = debug

    if not os.environ.get('TESTING', False):
    # only bind the session if we are not testing
        engine = sa.create_engine(DATABASE_URL)
        DBSession.configure(bind=engine)
    # configuration setup
    config = Configurator(
        settings=settings
    )
    config.include('pyramid_tm')
    config.include('pyramid_jinja2')
    config.add_route('home', '/')
    config.add_route('add', '/add')
    config.scan()
    app = config.make_wsgi_app()
    return app


if __name__ == '__main__':
    app = main()
    port = os.environ.get('PORT', 5000)
    serve(app, host='0.0.0.0', port=port)
