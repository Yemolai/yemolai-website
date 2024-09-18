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

  def get_user_game_highscore(user, game) when is_struct(user) do
    get_user_game_highscore(user.id, game)
  end

  def get_user_game_highscore(user_id, game) when is_number(user_id) do
    query =
      from s in Score,
        join: u in assoc(s, :user),
        select: %{id: s.id, points: s.points, username: u.username},
        order_by: [desc: s.points],
        where: s.game == ^game and s.user_id == ^user_id

    Repo.one(query)
  end

  def get_game_highscores(game, records_limit \\ 10) do
    query =
      from s in Score,
        join: u in assoc(s, :user),
        select: %{id: s.id, points: s.points, username: u.username},
        order_by: [desc: s.points],
        where: s.game == ^game,
        limit: ^records_limit

    Repo.all(query)
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
        {:ok, get_user_game_highscore(attrs.user_id, attrs.game)}
    end
  end
end
