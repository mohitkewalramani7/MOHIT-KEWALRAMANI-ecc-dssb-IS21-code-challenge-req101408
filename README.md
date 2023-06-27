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

:white_check_mark:
