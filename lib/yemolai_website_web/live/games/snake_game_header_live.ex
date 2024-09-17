defmodule YemolaiWebsiteWeb.Games.SnakeGameLive do
  use YemolaiWebsiteWeb, :layoutless_live_view

  alias YemolaiWebsite.Leaderboards
  import YemolaiWebsiteWeb.TopbarComponents
  import YemolaiWebsiteWeb.CoreComponents

  def mount(_params, session, socket) do
    current_user = Map.get(session, "current_user", nil)
    leaderboard = Leaderboards.get_game_highscores("snake")

    personal_best =
      if current_user, do: Leaderboards.get_user_game_highscore(current_user, "snake"), else: nil

    {:ok,
     assign(socket,
       current_user: current_user,
       routes: Map.get(session, "routes", []),
       leaderboard: leaderboard,
       personal_best: personal_best
     )}
  end

  def handle_event("snake_game_over", %{"points" => points}, socket)
      when socket.assigns.current_user != nil do
    current_user = socket.assigns.current_user
    Leaderboards.register_game_score(%{game: "snake", points: points, user_id: current_user.id})
    send(self(), :snake_game_init)
    {
      :noreply,
      assign(socket,
        leaderboard: Leaderboards.get_game_highscores("snake"),
        personal_best: Leaderboards.get_user_game_highscore(current_user, "snake")
      )
    }
  end

  def handle_event("snake_game_over", _params, socket) do
    {:noreply, socket}
  end

  def handle_info(:snake_game_init, socket) do
    JS.dispatch("snake-game-init", to: "document")
    {:noreply, socket}
  end

  def render(assigns) do
    ~H"""
    <.topbar routes={@routes}>
      <:title_block>
        Snake Game
      </:title_block>
    </.topbar>
    <.modal_dialog
      id="leaderboard-modal"
      title="Leaderboard"
      class="min-w-[32rem] max-w-full"
      close_on_click_away={true}
    >
      <ul>
        <%= for {score, i} <- Enum.with_index(@leaderboard) do %>
          <li>
            <%= i + 1 %>.
            <strong><%= format_score_points(score.points) %></strong> <%= score.username %>
          </li>
        <% end %>
      </ul>
      <p :if={@current_user == nil} class="mt-6">
        <.link href={~p"/users/log_in"} class="underline">Log in</.link>
        to see your personal best here!
      </p>
    </.modal_dialog>
    <div id="snake_game" phx-hook="RelayHook" />
    """
  end

  defp format_score_points(points, digits \\ 6) do
    points
    |> Integer.to_string()
    |> String.pad_leading(digits, "0")
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
