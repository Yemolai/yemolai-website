defmodule YemolaiWebsiteWeb.GamesController do
  use YemolaiWebsiteWeb, :controller

  def snake(conn, _params) do
    render(conn, :snake_game, layout: false, page_title: "Snake Game")
  end
end
