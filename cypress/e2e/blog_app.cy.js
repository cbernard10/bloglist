describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    cy.visit("http://localhost:5173");
  });

  it("Login form is shown", function () {
    cy.get("#usernameInput").should("be.visible");
    cy.get("#passwordInput").should("be.visible");
    cy.get("#loginButton").should("be.visible");
  });

  describe("Login", function () {
    it("succeeds with correct credentials", function () {
      cy.login({ username: "admin", password: "admin" });
      cy.contains("Admin logged in");
    });

    it("fails with wrong credentials", function () {
      cy.get("#usernameInput").type("user");
      cy.get("#passwordInput").type("admin");
      cy.get("#loginButton").click();

      cy.contains("Wrong credentials");
      cy.get("#notificationBox").should("have.css", "color", "rgb(255, 0, 0)");
    });
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "admin", password: "admin" });
    });

    it("A blog can be created", function () {
      cy.contains("new blog").click();
      cy.addBlog({
        title: "Test blog",
        author: "Test author",
        url: "Test url",
      });

      cy.contains("Test blog");
    });

    it("A blog can be liked", function () {
      cy.addBlog({
        title: "Test blog",
        author: "Test author",
        url: "Test url",
      });

      cy.contains("view").click();
      cy.get("#likeButton").click();
      cy.get("#likes").contains("1");
    });

    it("A blog can be deleted", function () {
      cy.addBlog({
        title: "Test blog",
        author: "Test author",
        url: "Test url",
      });

      cy.contains("view").click();
      cy.get("#deleteButton").click();
      cy.get("html").should("not.contain", "Test blog");
    });

    it("other user cannot delete blog", function () {
      cy.addBlog({
        title: "Test blog",
        author: "Test author",
        url: "Test url",
      });

      cy.contains("logout").click();
      cy.get("#usernameInput").type("user");
      cy.get("#passwordInput").type("user");
      cy.get("#loginButton").click();

      cy.contains("view").click();
      cy.get("#deleteButton").should("not.exist");
    });

    it("blogs are ordered according to number of likes", function () {
      cy.addBlog({
        title: "Test blog",
        author: "Test author",
        url: "Test url",
      });
      cy.addBlog({
        title: "Test blog2",
        author: "Test author2",
        url: "Test url2",
      });

      cy.contains("view").click();
      cy.contains("view").click();

      cy.get(".blog").eq(0).get("#likeButton").click();

      cy.wait(1000);

      cy.get(".blog").eq(0).should("contain", "Test blog");
      cy.get(".blog").eq(1).should("contain", "Test blog2");

      cy.get(".blog").eq(1).find("#likeButton").click();
      cy.wait(1000);
      cy.get(".blog").eq(1).find("#likeButton").click();
      cy.wait(1000);

      cy.get(".blog").eq(1).should("contain", "Test blog");
      cy.get(".blog").eq(0).should("contain", "Test blog2");
    });
  });
});
