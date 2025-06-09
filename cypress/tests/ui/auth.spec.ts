import { User } from "../../../src/models";
import { isMobile } from "../../support/utils";

const apiGraphQL = `${Cypress.env("apiUrl")}/graphql`;

describe("User Sign-up and Login", function () {
  beforeEach(function () {
    // reseed the database. This ensures that the database is reset to a known state
    cy.task("db:seed");

    // Intercept all POST requests to /users (user sign-up API) and alias them as "signup" for use in tests
    cy.intercept("POST", "/users").as("signup");
    // Intercept POST requests to the GraphQL endpoint and alias those with operationName "CreateBankAccount" as "gqlCreateBankAccountMutation".
    // This lets tests wait for or assert against the specific create bank account mutation request.
    cy.intercept("POST", apiGraphQL, (req) => {
      const { body } = req;

      if (body.hasOwnProperty("operationName") && body.operationName === "CreateBankAccount") {
        req.alias = "gqlCreateBankAccountMutation";
      }
    });
  });

  it("should remember a user for 30 days after login", function () {
    cy.database("find", "users").then((user: User) => {
      cy.login(user.username, "s3cret", { rememberUser: true });
    });

    // Verify Session Cookie
    cy.getCookie("connect.sid").should("have.property", "expiry");

    // Logout User
    if (isMobile()) {
      cy.getBySel("sidenav-toggle").click();
    }
    cy.getBySel("sidenav-signout").click();
    cy.location("pathname").should("eq", "/signin");
    cy.visualSnapshot("Redirect to SignIn");
  });

  it("should allow a visitor to sign-up, login, and logout", function () {
    const userInfo = {
      firstName: "Bob",
      lastName: "Ross",
      username: "PainterJoy90",
      password: "s3cret",
    };

    // TODO: Sign up a new user through the UI
    // Tip: Navigate to the sign-up form, fill in user details, submit, and confirm success
    // (e.g., by waiting for the signup API or a UI change).
    cy.visit("/");

    // TODO: Login User

    // Onboarding
    cy.getBySel("user-onboarding-dialog").should("be.visible");
    cy.getBySel("list-skeleton").should("not.exist");
    cy.getBySel("nav-top-notifications-count").should("exist");
    cy.visualSnapshot("User Onboarding Dialog");

    cy.getBySel("user-onboarding-next").click();

    cy.getBySel("user-onboarding-dialog-title").should("contain", "Create Bank Account");

    // TODO: Fill in the bank account onboarding form and submit
    // Tip: Wait for the create bank account API call to complete

    // Verify the bank account creation in the onboarding finish dialog
    cy.getBySel("user-onboarding-dialog-title").should("contain", "Finished");
    cy.getBySel("user-onboarding-dialog-content").should("contain", "You're all set!");
    cy.visualSnapshot("Finished User Onboarding");
    cy.getBySel("user-onboarding-next").click();

    cy.getBySel("transaction-list").should("be.visible");
    cy.visualSnapshot("Transaction List is visible after User Onboarding");

    // Logout User
    if (isMobile()) {
      cy.getBySel("sidenav-toggle").click();
    }

     // TODO: Click the sign out button in the left navigation bar and verify redirect to sign-in page
    cy.visualSnapshot("Redirect to SignIn");
  });

  it("should display login errors", function () {
    cy.visit("/");

    // TODO: Test username and password field validation
  });

  it("should display signup errors", function () {
    cy.visit("/signup");

    // TODO: Test sign up form field validation
  });

  it("should error for an invalid user", function () {
    // TODO: Attempt to login with an invalid username and password
    cy.login("invalidUserName", "invalidPa$$word");

    cy.getBySel("signin-error")
      .should("be.visible")
      .and("have.text", "Username or password is invalid");
    cy.visualSnapshot("Sign In, Invalid Username and Password, Username or Password is Invalid");
  });

  it("should error for an invalid password for existing user", function () {
    // TODO: Attempt to login with an invalid password
  });
});
