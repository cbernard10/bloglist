import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

describe("BlogForm", () => {
  test("form calls event handler 'addBlog' with the right details (whatever that means?)", async () => {
    const mockAddBlog = jest.fn();
    const mockSetVisible = jest.fn();
    const mockSetMessage = jest.fn();

    const user = userEvent.setup();

    const container = render(
      <BlogForm
        addBlog={mockAddBlog}
        setBlogFormVisible={mockSetVisible}
        setMessage={mockSetMessage}
      />
    ).container;

    const titleInput = container.querySelector("#titleInput");
    const authorInput = container.querySelector("#authorInput");
    const urlInput = container.querySelector("#urlInput");

    await user.type(titleInput, "test title");
    await user.type(authorInput, "test author");
    await user.type(urlInput, "test url");

    const saveButton = screen.getByText("save");
    await user.click(saveButton);

    // const save = screen.getByText("save");
    // await user.click(save);

    expect(mockAddBlog.mock.calls).toHaveLength(1);
  });
});
