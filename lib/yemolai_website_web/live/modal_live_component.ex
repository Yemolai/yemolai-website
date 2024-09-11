defmodule YemolaiWebsiteWeb.Live.ModalLiveComponent do
  @moduledoc """
    Modal Live Component Wrapper to use controlled modals in LiveViews
  """
  use Phoenix.LiveComponent

  slot :inner_block, required: true

  def render(assigns) do
    ~H"""
    <dialog id={@id} phx-hook="ModalHook" open={@is_open}>
      <%= render_slot @inner_block %>
    </dialog>
    """
  end

  def update(%{is_open: is_open, inner_block: inner_block} = assigns, socket) do
    {:ok,
     assign(
       socket,
       assigns
       |> Map.put(:is_open, is_open)
       |> Map.put(:inner_block, inner_block)
     )}
  end
end
