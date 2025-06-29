# Configure Rails Environment
ENV['RAILS_ENV'] = 'test'

require File.expand_path('../dummy/config/environment.rb', __FILE__)

require 'test/unit'
require 'mocha'
require 'rails/test_help'
require 'mocha/test_unit'
require 'webmock/minitest'

require 'wicked_pdf'

Rails.backtrace_cleaner.remove_silencers!
WickedPdf.silence_deprecations = true

if (assets_dir = Rails.root.join('app/assets')) && File.directory?(assets_dir)
  # Copy CSS file
  destination = assets_dir.join('stylesheets/wicked.css')
  source = File.read('test/fixtures/wicked.css')
  File.open(destination, 'w') { |f| f.write(source) }

  # Copy JS file
  js_dir = assets_dir.join('javascripts')
  Dir.mkdir(js_dir) unless File.directory?(js_dir)
  destination = js_dir.join('wicked.js')
  source = File.read('test/fixtures/wicked.js')
  File.open(destination, 'w') { |f| f.write(source) }

  Dir.mkdir(js_dir.join('subdirectory')) unless File.directory?(js_dir.join('subdirectory'))
  destination = js_dir.join('subdirectory/nested.js')
  source = File.read('test/fixtures/subdirectory/nested.js')
  File.open(destination, 'w') { |f| f.write(source) }

  config_dir = assets_dir.join('config')
  Dir.mkdir(config_dir) unless File.directory?(config_dir)
  source = File.read('test/fixtures/manifest.js')
  destination = config_dir.join('manifest.js')
  File.open(destination, 'w') { |f| f.write(source) }
end
