defmodule YemolaiWebsiteWeb.PageController do
  use YemolaiWebsiteWeb, :controller

  def home(conn, _params) do
    # The home page is often custom made,
    # so skip the default app layout.
    render(conn, :home, layout: false, page_title: "Resume")
  end

  def projects(conn, _params) do
    render(conn, :projects, page_title: "Projects")
  end
end
