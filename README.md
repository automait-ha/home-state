## Quickstart

    docker run -d -p 4578:4578 --name home-state --restart=always home-state

## With custom config

    docker run -d -v /path/to/config/dir:/config -p 4578:4578 --name home-state --restart=always home-state

## config.json

    { "defaultState": "My Default State"
    }
