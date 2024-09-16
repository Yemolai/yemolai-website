defmodule YemolaiWebsiteWeb.Games.SnakeGameHeaderLive do
  use YemolaiWebsiteWeb, :layoutless_live_view

  alias YemolaiWebsite.Leaderboards
  import YemolaiWebsiteWeb.TopbarComponents
  import YemolaiWebsiteWeb.CoreComponents

  def mount(_params, session, socket) do
    leaderboard = Leaderboards.get_game_highscores("snake")

    {:ok,
     assign(socket,
       current_user: Map.get(session, "current_user", nil),
       routes: Map.get(session, "routes", []),
       leaderboard: leaderboard
     )}
  end

  def render(assigns) do
    ~H"""
    <.topbar routes={@routes}>
      <:title_block>
        Snake Game
      </:title_block>
    </.topbar>
    <div class="w-full text-center">
      <.button phx-click={JS.dispatch("open-modal", to: "#leaderboard-modal")}>
        Leaderboard
      </.button>
    </div>
    <.modal_dialog id="leaderboard-modal" title="Leaderboard" class="min-w-[32rem] max-w-full" close_on_click_away={true}>
      <ul>
        <%= for {score, i} <- Enum.with_index(@leaderboard) do %>
          <li>
            <%= i + 1 %>.
            <strong><%= format_score_points(score.points) %></strong> <%= score.username %>
          </li>
        <% end %>
      </ul>
    </.modal_dialog>
    """
  end

  defp format_score_points(points) do
    points
    |> Integer.to_string()
    |> String.pad_leading(9, "0")
    # prepare data
    |> to_charlist()
    # reverse the entire string
    |> Enum.reverse()
    # split in groups of 3
    |> Enum.chunk_every(3)
    # reverse each group
    |> Enum.map(&Enum.reverse(&1))
    # reverse the entire thing
    |> Enum.reverse()
    # join with commas
    |> Enum.join(",")
  end
end
