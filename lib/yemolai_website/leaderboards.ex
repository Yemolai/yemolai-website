defmodule YemolaiWebsite.Leaderboards do
  @moduledoc """
  The Leaderboards context.
  """

  import Ecto.Query, warn: false
  alias YemolaiWebsite.Repo
  alias YemolaiWebsite.Leaderboards.Score

  def get_user_highscores(user) do
    Repo.get_by(Score, user_id: user.id)
  end

  def get_user_game_highscores(user_id, game) when is_number(user_id) do
    Repo.get_by(Score, user_id: user_id, game: game)
    |> Repo.preload(:user)
  end

  def get_user_game_highscores(user, game) do
    Repo.get_by(Score, user: user, game: game)
    |> Repo.preload(:user)
  end

  def get_game_highscores(game) do
    Repo.all(Score, game: game)
    |> Repo.preload(:user)
  end

  def register_game_score(attrs) do
    conflict_query =
      from(s in Score,
        update: [
          set: [
            points: fragment("EXCLUDED.points"),
            updated_at: fragment("NOW() at time zone 'utc'")
          ]
        ],
        where: fragment("EXCLUDED.points > ?", s.points)
      )

    try do
      %Score{}
      |> Score.registration_changeset(attrs)
      |> Repo.insert(
        conflict_target: [:user_id, :game],
        on_conflict: conflict_query,
        returning: true
      )
    rescue
      Ecto.StaleEntryError ->
        {:ok, get_user_game_highscores(attrs.user_id, attrs.game)}
    end
  end
end
