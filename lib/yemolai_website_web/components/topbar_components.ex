defmodule YemolaiWebsiteWeb.TopbarComponents do
  @moduledoc """
    Implements the Topbar components
  """
  use Phoenix.Component

  attr :href, :string, required: true
  attr :label, :string, required: true
  attr :class, :string, default: ""
  attr :method, :string, default: "get"

  def desktop_topbar_link(assigns) do
    ~H"""
    <.link href={@href} method={@method} class={["hover:text-zinc-700 underline", @class]}>
      <%= @label %>
    </.link>
    """
  end

  attr :href, :string, required: true
  attr :label, :string, required: true
  attr :class, :string, default: ""
  attr :method, :string, default: "get"

  def mobile_topbar_link(assigns) do
    ~H"""
    <.link
      href={@href}
      method={@method}
      class={[
        "text-[0.8125rem] leading-6 text-zinc-900 hover:text-zinc-700 underline",
        @class
      ]}
    >
      <%= @label %>
    </.link>
    """
  end

  slot :inner_block, required: true

  def mobile_menu_item(assigns) do
    ~H"""
    <li class="py-2 px-4 w-full text-[0.8125rem] leading-6 text-zinc-900 hover:bg-slate-200 hover:text-zinc-900">
      <%= render_slot(@inner_block) %>
    </li>
    """
  end

  attr :routes, :list, required: true
  attr :title, :string
  slot :title_block

  def topbar(assigns) do
    ~H"""
    <div class="flex items-center justify-between border-b border-zinc-100 py-1 text-sm w-full max-w-full">
      <div class="flex items-center gap-4">
        <p class="inline-block text-zinc-900 pl-4 font-bold leading-7">
          <%= render_slot @title_block %>
        </p>
      </div>
      <div>
        <div class="hidden md:flex flex-row items-center gap-x-4 pr-6 font-semibold leading-6 text-zinc-900">
          <%= for route <- @routes do %>
            <.desktop_topbar_link
              href={route.href}
              label={route.label}
              method={Map.get(route, :method)}
              class={Map.get(route, :class)}
            />
          <% end %>
        </div>
        <button
          class="block md:hidden border-none bg-transparent mr-6"
          onclick="document.getElementById('topbar-menu').open ? document.getElementById('topbar-menu').close() : document.getElementById('topbar-menu').show()"
        >
          &#9776; <!-- hamburger menu icon aka trigram for heaven -->
          <div class="relative">
            <dialog
              id="topbar-menu"
              class="ml-2 rounded-md border border-slate-300 transform -translate-x-full"
            >
              <ul class="flex flex-col items-center gap-0 font-semibold leading-6 text-zinc-600">
                <%= for route <- @routes do %>
                  <.mobile_menu_item>
                    <.mobile_topbar_link
                      href={route.href}
                      label={route.label}
                      method={Map.get(route, :method)}
                      class={Map.get(route, :class)}
                    />
                  </.mobile_menu_item>
                <% end %>
              </ul>
            </dialog>
          </div>
        </button>
      </div>
    </div>
    """
  end
end
