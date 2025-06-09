import { interpret } from "xstate";
import { MemoryRouter } from "react-router-dom";
import SignInForm from "./SignInForm";
import { authMachine } from "../machines/authMachine";

describe("SignInForm", () => {
  let authService;
  beforeEach(() => {
    authService = interpret(authMachine);
    authService.start();

    expect(authService.state.value).to.equal("unauthorized");
    // TODO: Intercept the login POST request to http://localhost:3001/login
    // and stub the response to return a user object with the following fields:
    // {
    //   id: "t45AiwidW",
    //   uuid: "6383f84e-b511-44c5-a835-3ece1d781fa8",
    //   firstName: "Edgar",
    //   lastName: "Johns",
    //   username: "Katharina_Bernier",
    //   password: "$2a$10$5PXHGtcsckWtAprT5/JmluhR13f16BL8SIGhvAKNP.Dhxkt69FfzW",
    //   email: "Norene39@yahoo.com",
    //   phoneNumber: "625-316-9882",
    //   avatar: "https://cypress-realworld-app-svgs.s3.amazonaws.com/t45AiwidW.svg",
    //   defaultPrivacyLevel: "public",
    //   balance: 168137,
    //   createdAt: "2019-08-27T23:47:05.637Z",
    //   modifiedAt: "2020-05-21T11:02:22.857Z"
    // }
  });

  it("submits the username and password to the backend", () => {
    cy.mount(
      <MemoryRouter>
        <SignInForm authService={authService} />
      </MemoryRouter>
    );

    // TODO: Simulate user sign-in and verify successful authentication.

    // Assert that no error is displayed and authentication state is updated.
    cy.wrap(null).should(() => {
      expect(authService.state.value).to.equal("authorized");
    });
  });
});
