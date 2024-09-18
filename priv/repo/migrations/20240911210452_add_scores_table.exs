defmodule YemolaiWebsite.Repo.Migrations.AddLeaderboardTable do
  use Ecto.Migration

  def change do
    execute "CREATE EXTENSION IF NOT EXISTS citext", ""

    create table(:scores) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :game, :citext, null: false
      add :points, :integer, null: false
      timestamps(type: :utc_datetime)
    end

    create index(:scores, [:game])
    create index(:scores, [:user_id])
    create unique_index(:scores, [:user_id, :game])
  end
end
