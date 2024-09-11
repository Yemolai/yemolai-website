defmodule YemolaiWebsiteWeb.Games.SnakeGameHeaderLive do
  use Phoenix.LiveView

  import YemolaiWebsiteWeb.TopbarComponents
  import YemolaiWebsiteWeb.CoreComponents

  def mount(_params, session, socket) do
    {:ok,
     assign(socket,
       current_user: Map.get(session, "current_user", nil),
       routes: Map.get(session, "routes", []),
       is_modal_open: false
     )}
  end

  def handle_event("leaderboard_modal", %{"open" => open}, socket) do
    {:noreply, assign(socket, is_modal_open: open == "true")}
  end

  def render(assigns) do
    ~H"""
    <.topbar routes={@routes}>
      <:title_block>
        Snake Game
      </:title_block>
    </.topbar>
    <.button phx-click="leaderboard_modal" phx-value-open="true">Show Leaderboard</.button>
    <dialog open={@is_modal_open}>
      <div class="flex justify-between">
        <p>Leaderboard</p>
        <.button phx-click="leaderboard_modal" phx-value-open="false">&times;</.button>
      </div>
    </dialog>
    """
  end
end
