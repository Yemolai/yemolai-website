defmodule YemolaiWebsiteWeb.Games.SnakeGameHeaderLive do
  use YemolaiWebsiteWeb, :layoutless_live_view

  import YemolaiWebsiteWeb.TopbarComponents
  import YemolaiWebsiteWeb.CoreComponents

  def mount(_params, session, socket) do
    {:ok,
     assign(socket,
       current_user: Map.get(session, "current_user", nil),
       routes: Map.get(session, "routes", [])
     )}
  end

  def render(assigns) do
    ~H"""
    <.topbar routes={@routes}>
      <:title_block>
        Snake Game
      </:title_block>
    </.topbar>
    <.button phx-click={JS.dispatch("open-modal", to: "#leaderboard-modal")}>
      Show Leaderboard
    </.button>
    <.modal_dialog id="leaderboard-modal" title={"Leaderboard"} class={"min-w-[32rem] max-w-full"}>
      <ul>
        <li>Item 01</li>
        <li>Item 02</li>
        <li>Item 03</li>
        <li>Item 04</li>
        <li>Item 05</li>
        <li>Item 06</li>
        <li>Item 07</li>
        <li>Item 08</li>
        <li>Item 09</li>
        <li>Item 10</li>
        <li>Item 11</li>
        <li>Item 12</li>
        <li>Item 13</li>
        <li>Item 14</li>
        <li>Item 15</li>
        <li>Item 16</li>
      </ul>
    </.modal_dialog>
    """
  end
end
