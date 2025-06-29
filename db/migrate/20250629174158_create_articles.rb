class CreateArticles < ActiveRecord::Migration[7.1]
  def change
    create_table :articles do |t|
      t.string :title
      t.text :content
      t.string :author
      t.datetime :published_at
      t.string :medium_url
      t.boolean :featured

      t.timestamps
    end
  end
end
