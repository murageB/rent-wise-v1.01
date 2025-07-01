class AddSeoFieldsToArticles < ActiveRecord::Migration[7.1]
  def change
    add_column :articles, :meta_description, :text
    add_column :articles, :keywords, :text
    add_column :articles, :category, :string
    add_column :articles, :status, :string
    add_column :articles, :seo_title, :string
  end
end
