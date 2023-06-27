# README

This is Mohit Kewalramani's submission for the ecc-dssb-code-challenge-req101408
project, for the Full Stack Developer role. The README here will walk you through
the app's installation and setup. I've also included some outlines of the user
stories in the requirements and how my app meets the requirements.

## Tech Stack Used

1. Back-End - Express JS
1. Front-End - Next JS

## Pre-Requisites

The assignment outline mentions that the marking panel will have node and npm
installed on the machine. That is sufficient to get the installation going.

## Installation

To install the application (both front and back ends), checkout the project, and
run `npm install` when present in the root directory of the project

## Getting Started

Once the installation is complete, we are ready to run our application. This
package has both a front and back ready to start. We will need two terminal tabs
to run them, one for each.

Let's start with the back-end. To run the server for the back-end, run the command

```bash
npm run server
```

The server should start at url `http:localhost:8080/api`, as specified in the documentation

Next, let's start up the front-end.

```bash
npm run dev
```

The front-end is configured to run on port `3001`, given that we have the API
running on port `3000`. Navigating to `http://localhost:3001` should open
the landing page of the application.

## User Stories

### User Story 1 Acceptance Criteria
> All columns fit on the page
- :white_check_mark: All columns do fit on the page, but with a need to scroll horizontally given the amount of information represented in the table
> I can see a title for each column
- :white_check_mark: Titles are visible at the top of each column
> I can see a total number of all products at ECC
- :white_check_mark: The total number of products across all pages (pagination) is
mentioned at the bottom-right corner of the table

### User Story 2 Acceptance Criteria

> Product number generated is automatic, and doesn’t collide with previously generated product IDs
- :white_check_mark: The back-end computes a product number based on the unix timestamp
when the record was created, thus there is no possibility of a conflict
> User must answer all questions in order to save
- :white_check_mark: Form on front end makes sure all fields are required with feedback for the user. Checks
for all fields required are also done on the back end.
> Click on save button
- :white_check_mark: The `Create` button sends a POST request to the back-end to create
the product record

### User Story 3 Acceptance Criteria
> Call to action button for saving exits
- :white_check_mark: Clicking on the `Update` button when viewing a product record
sends a PUT request to the back-end to update a product record
> I can see my changes saved immediately
- :white_check_mark: Once the PUT request succeeds, the form closes and the user
gets a notification
- :white_check_mark: The table's data refreshes and we can see the updated data
in the table
> Data created or edited is persistent through the event of a page refresh
- :white_check_mark: Refreshing the page simply retrieves the data in-memory present
on the server. As long as we don't re-start the server (which would clear its memory), all our data will be persistent.
