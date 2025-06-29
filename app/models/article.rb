class Article < ApplicationRecord
  validates :title, presence: true
  validates :content, presence: true
  validates :author, presence: true
  validates :published_at, presence: true
  
  scope :published, -> { where('published_at <= ?', Time.current) }
  scope :featured, -> { where(featured: true) }
  scope :recent, -> { order(published_at: :desc) }
  
  def excerpt
    content.truncate(200, separator: ' ')
  end
  
  def reading_time
    words_per_minute = 200
    word_count = content.split.size
    minutes = (word_count / words_per_minute.to_f).ceil
    "#{minutes} min read"
  end
end
