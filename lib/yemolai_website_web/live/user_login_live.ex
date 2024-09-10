defmodule YemolaiWebsiteWeb.UserLoginLive do
  use YemolaiWebsiteWeb, :live_view

  def render(assigns) do
    ~H"""
    <div class="mx-auto max-w-sm">
      <.header class="text-center">
        Log in to account
        <:subtitle>
          Don't have an account?
          <.link navigate={~p"/users/register"} class="font-semibold text-brand hover:underline">
            Sign up
          </.link>
          for an account now.
        </:subtitle>
      </.header>

      <div :if={@form_mode == "password"}>
        <.simple_form for={@form} id="login_form" action={~p"/users/log_in"} phx-update="ignore">
          <.input field={@form[:email]} type="email" label="Email address" required />
          <.input field={@form[:password]} type="password" label="Password" required />

          <:actions>
            <.input field={@form[:remember_me]} type="checkbox" label="Keep me logged in" />
            <.link href={~p"/users/reset_password"} class="text-sm font-semibold">
              Forgot your password?
            </.link>
          </:actions>
          <:actions>
            <.button phx-disable-with="Logging in..." class="w-full bg-blue-800">
              Log in <span aria-hidden="true">→</span>
            </.button>
          </:actions>
        </.simple_form>
        <.button class="w-full mt-3 bg-blue-700" phx-click="swap_form_mode" phx-value-target_mode="magic_link">
          Use Magic Link instead
        </.button>
      </div>

      <div :if={@form_mode == "magic_link"}>
        <.simple_form for={@form} id="magic_link_form" action={~p"/users/log_in?action=magic_link"} phx-update="ignore" class="my-0 py-0">
          <.input field={@form[:email]} type="email" label="Email address" required />
          <:actions>
            <.button phx-disable-with="Logging in..." class="w-full bg-blue-700">
              Send me a link <span aria-hidden="true">✉️</span>
            </.button>
          </:actions>
        </.simple_form>
        <.button class="w-full mt-3 bg-blue-600" phx-click="swap_form_mode" phx-value-target_mode="password">
          Use Password instead
        </.button>
      </div>
    </div>
    """
  end

  def mount(_params, _session, socket) do
    email = Phoenix.Flash.get(socket.assigns.flash, :email)
    form = to_form(%{"email" => email}, as: "user")
    {:ok, assign(socket, form: form, form_mode: "magic_link"), temporary_assigns: [form: form]}
  end

  def handle_event("swap_form_mode", %{"target_mode" => target_mode}, socket) do
    {:noreply, assign(socket, form_mode: target_mode)}
  end

  def handle_event("swap_form_mode", _params, socket) do
    [:noreply, socket]
  end
end
