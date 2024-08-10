defmodule YemolaiWebsiteWeb.GamesController do
  use YemolaiWebsiteWeb, :controller

  def snake(conn, _params) do
    render(conn, :snake_game, page_title: "Snake Game")
  end
end
