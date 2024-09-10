defmodule YemolaiWebsiteWeb.Games.SnakeGameHeaderLive do
  use Phoenix.LiveView

  alias YemolaiWebsiteWeb.TopbarComponents

  def render(assigns) do
    ~H"""
    <TopbarComponents.topbar routes={@routes}>
      <:title_block>Other title</:title_block>
    </TopbarComponents.topbar>
    """
  end

  def mount(_params, %{"current_user" => current_user, "routes" => routes} = _session, socket) do
    {:ok, assign(socket, current_user: current_user, routes: routes)}
  end

  def mount(_params, %{"current_user" => current_user} = _session, socket) do
    {:ok, assign(socket, current_user: current_user, routes: [])}
  end

  def mount(_params, %{"routes" => routes} = _session, socket) do
    {:ok, assign(socket, current_user: nil, routes: routes)}
  end

  def mount(_params, _session, socket) do
    {:ok, assign(socket, current_user: nil, routes: [])}
  end
end
