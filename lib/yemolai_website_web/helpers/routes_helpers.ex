defmodule YemolaiWebsiteWeb.Helpers.RoutesHelpers do
  @moduledoc """
  Provide routes to build links lists
  """

  def init(opts), do: opts

  def call(conn, _opt) do
    Plug.Conn.assign(conn, :routes, routes_list(conn.assigns[:current_user]))
  end

  def routes_list(current_user) when current_user == nil do
    base_list() ++
      [
        %{href: "/users/log_in", label: "Log in"}
      ]
  end

  def routes_list(current_user) do
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
