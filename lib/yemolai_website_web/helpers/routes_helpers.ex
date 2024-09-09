defmodule YemolaiWebsiteWeb.Helpers.RoutesHelpers do
  @moduledoc """
  Provide routes to build links lists
  """
  import Phoenix.LiveView.Utils
  alias YemolaiWebsite.Accounts

  def init(opts), do: opts

  def call(conn, _opt) do
    Plug.Conn.assign(conn, :routes, routes_list(conn.assigns[:current_user]))
  end

  def on_mount(:default, _params, session, socket) do
    socket = assign_new(socket, :routes, fn ->
      if socket.assigns.current_user do
        routes_list_from_session(session)
      else
        routes_list(socket.assigns.current_user)
      end
    end)
    {:cont, socket}
  end

  defp routes_list_from_session(%{"user_token" => user_token}) do
    current_user = Accounts.get_user_by_session_token(user_token)
    routes_list(current_user)
  end

  defp routes_list_from_session(_session) do
    routes_list(nil)
  end

  defp routes_list(current_user) when current_user == nil do
    base_list() ++
      [
        %{href: "/users/log_in", label: "Log in"}
      ]
  end

  defp routes_list(current_user) do
    base_list() ++
      [
        %{href: "#", label: current_user.email},
        %{href: "/users/settings", label: "Settings"},
        %{href: "/users/log_out", label: "Log out", method: "delete"}
      ]
  end

  defp base_list() do
    [
      %{href: "/", label: "Resume"},
      %{href: "https://github.com/yemolai/yemolai-website", label: "GitHub"},
      %{href: "https://www.linkedin.com/in/romulo-gabriel-rodrigues/", label: "LinkedIn"},
      %{href: "https://app.reclaim.ai/m/gabriel-rodrigues/quick-meeting", label: "Schedule"},
      %{href: "mailto:work@romulogabriel.dev", label: "Mail"}
    ]
  end
end
