# this is for internal use - do not change it!
config-version: 1

# global settings which apply across the entire plugin/server
settings:

  # set which language file to use. only english is supplied,
  # but you can add your own (PRs welcome)
  language-file: lang-en.yml

  # output extra information to console (can be spammy)
  debug-mode: false

  # enable/disable checking for updates on startup
  update-checker: true

  # set the web address players use to connect to your map. this
  # is only used for the fabric client mod to know where to connect
  web-address: http://localhost:8080

  # web directory settings (where all the public files go)
  web-directory:

    # the path where the public web directory is
    # relative paths are from the plugin directory
    # absolute paths will work here, too
    path: web

    # should the plugin overwrite all the public web files when
    # the plugin starts up set to false if you want to edit the
    # files by hand, but be warned you will have to keep the
    # files updated yourself when internal changes happen
    auto-update: true

  # Control the quality of the tile images
  image-quality:

    # The compression of the PNG tile images
    # (0.0 to favor speed, 1.0 to favor compression)
    # Compression may or may not slow down renders a bit.
    compress-images:
        enabled: false
        value: 0.0

  # the internal web server settings
  internal-webserver:

    # set to true to use the internal web server.
    # set to false if you want to run your own
    # external web server
    enabled: true

    # the ip the internal web server will bind to
    # (leave this alone if you don't know what it does)
    bind: 0.0.0.0

    # the port the internal web server will bind to
    port: 8080

  # global UI settings
  ui:

    # this controls the box showing coordinates on mouse position
    coordinates:

      # show the coordinates box on the map
      enabled: false

    # this is the link box containing a link to the current map view
    link:

      # show the link box on the map
      enabled: false

    # side bar options
    sidebar:

      # sidebar pin control. possible values are:
      # pinned - default to pulled out and pinned
      # unpinned - default to pushed in and unpinned
      # hide - default to pushed in and hide the pin button
      pinned: hide

  # Edit the commands and aliases registered by this plugin
  commands:

    # The main command used
    main-command-label: squaremap

    # List of aliases to the main command
    main-command-aliases:
    - map

  # configure whether renders log progress and how often
  render-progress-logging:
    enabled: true
    interval-seconds: 1

# per-world map settings
world-settings:

  # default settings to be applied to all loaded worlds
  default:

    # settings for the map of this world
    map:

      # is the map enabled for this world
      enabled: true

      # the world's display name
      # the variable {world} will be replaced by the real name
      # of the world
      display-name: '{world}'

      # allows specifying a custom order for the world list. sorted from lowest to highest value.
      order: 0

      # the icon to use for this world. icons are located in
      # the web/images/icons/ folder.
      # only png files are allowed.
      # do not include the .png file extension here.
      # leave an empty string to use the default icon for this
      # world type.
      icon: ''

      # when scanning for blocks to render, should we iterate up
      # or iterate down. default is to iterate down from max-height
      # until a valid block is found.
      # iterating up can be useful for nether worlds if you want
      # to render the lower portions of the map that are hidden
      # by the higher islands, for example.
      iterate-up: false

      # the maximum height which to draw blocks on the map.
      # use -1 to use the world's max build height.
      max-height: -1

      # This number of JVM threads to use for rendering
      # (this is _not_ the same as cpu threads/cores)
      # use -1 to use half the available threads
      max-render-threads: -1

      # The background-render where automatic updates are
      # performed from triggered events
      background-render:

        # Enable this feature.
        enabled: true

        # The maximum amount of chunks to render from the queue at
        # time. Setting this too high may cause lag on your main
        # thread if the queue gets too large
        max-chunks-per-interval: 1024

        # How often to check the queue for any chunks needing updates
        interval-seconds: 15

        # This number of JVM threads to use for background rendering
        # (this is _not_ the same as cpu threads/cores)
        # use -1 to use half of the available threads
        max-render-threads: -1

      # biome specific settings
      biomes:

        # should biomes be rendered on the map
        enabled: true

        # should biome grass/foliage blend together (like in game)
        # possible values are 0 - 15
        # 0 will disable this feature
        blend-biomes: 3

      # glass settings
      glass:

        # use translucent/clear colors for glass
        clear: true

      # lava specific settings
      lava:

        # should lava render checkerboard pattern for depth
        checkerboard: true

      # water settings
      water:

        # should water be translucent (see through)
        clear-depth: true

        # should water render checkerboard pattern for depth
        checkerboard: false

      # zoom settings
      zoom:

        # the maximum zoom level
        # (it is advised to make this the default zoom level)
        maximum: 3

        # the default zoom level
        # (where original tiles will be drawn)
        default: 3

        # extra zoom in levels beyond default
        extra: 2

      # world markers
      markers:

        # how often to check for updates of the world markers
        update-interval-seconds: 15

        # the spawn point of the world
        spawn-icon:

          # show the spawn point marker
          enabled: false

          # show the layer control for the spawn point
          show-controls: true

          # hide the layer control (unchecked) by default
          default-hidden: false

          # the priority of the layer control in the control box
          layer-priority: 0

          # the z-index of the spawn marker on the map
          z-index: 0

        # the vanilla world border marker
        world-border:

          # show the vanilla world border on the map
          enabled: true

          # show the layer control for the spawn point
          show-controls: true

          # hide the layer control (unchecked) by default
          default-hidden: false

          # the priority of the layer control in the control box
          layer-priority: 1

          # the z-index of the world border on the map
          z-index: 1

      # allows restricting the render-able area of the map. note that this will not affect already-rendered regions.
      visibility-limits:
      -   type: world-border
          enabled: 'true'

    # player tracker settings
    player-tracker:

      # show players on the map
      enabled: false

      # how often to update the players
      update-interval-seconds: 1

      # show the layer control for player tracker
      show-controls: true

      # hide the layer control (unchecked) by default
      default-hidden: false

      # the priority of the layer control in the control box
      layer-priority: 2

      # the z-index of the player markers on the map
      z-index: 2

      # nameplate settings on player markers
      nameplate:

        # show nameplate on player markers
        enabled: true

        # show player heads in nameplates
        show-head: true

        # The url where player heads are fetched from
        # valid variables are {uuid} and {name}
        heads-url: https://mc-heads.net/avatar/{uuid}/16

        # show player's armor in the nameplate
        show-armor: true

        # show player's health in the nameplate
        show-health: true

      # player hide settings
      hide:

        # hide invisible players (potion)
        invisible: true

        # hide players in spectator gamemode
        spectators: true

      # whether to use display names/colored nicknames instead of usernames on the map
      use-display-names: false