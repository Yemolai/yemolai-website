defmodule YemolaiWebsite.Leaderboards.Score do
  use Ecto.Schema
  require YemolaiWebsite.Leaderboards.Enums
  alias YemolaiWebsite.Leaderboards.Enums
  import Ecto.Changeset

  @moduledoc """
  Defines the Score schema.
  """

  schema "scores" do
    field :points, :integer
    field :game, :string
    belongs_to :user, YemolaiWebsite.Accounts.User

    timestamps()
  end

  def registration_changeset(score, attrs, _opts \\ []) do
    score
    |> cast(attrs, [:game, :points, :user_id])
    |> validate_required([:game, :points, :user_id])
    |> assoc_constraint(:user)
    |> validate_number(:points, greater_than_or_equal_to: 0)
    |> validate_inclusion(:game, Enums.games_available)
  end
end
