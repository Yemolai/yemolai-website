defmodule YemolaiWebsiteWeb.PageControllerTest do
  use YemolaiWebsiteWeb.ConnCase

  test "GET /", %{conn: conn} do
    conn = get(conn, ~p"/")
    assert html_response(conn, 200) =~ "Software Engineer"
  end
end
