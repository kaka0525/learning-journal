Feature: Homepage
    A listing of entries from the learning journal in reverse
    chronological order

Scenario: The Homepage lists entries for anonymous users
    Given an anonymous user
    And a list of 3 entries
    When the user vists the homepage
    Then they see a list of 3 entries

Scenario: Markdown
    Given an authorized user
    When the user adds an entry
    Then that entry fomats with markdown

