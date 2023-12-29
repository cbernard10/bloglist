import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("Blog", () => {
  let container;
  const mockHandler = jest.fn();

  beforeEach(() => {


    const blog = {
      title: "test blog",
      author: "test author",
      likes: 0,
      url: "test url",
      user: {
        name: "test user",
      },
    };

    container = render(
      <Blog blog={blog} user={{ name: "test user" }} handleLike={mockHandler} />
    ).container;
  });

  test("shows title and author but not likes and url", async () => {
    const div = container.querySelector(".basicInfo");
    expect(div).toHaveStyle("display: flex");

    const div2 = container.querySelector(".moreInfo");
    expect(div2).toHaveStyle("display: none");
  });

  test("shows likes and url when view button is clicked", async () => {
    const user = userEvent.setup();

    const button = screen.getByText("view");
    await user.click(button);

    const div = container.querySelector(".moreInfo");
    expect(div).toHaveStyle("display: flex");
  });

  test("if like button is clicked twice, event handler is called twice", async () => {

    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    const like = screen.getByText("like");
    await user.click(like);
    await user.click(like);
    expect(mockHandler.mock.calls).toHaveLength(2);
  });

  // test()
});
