export type Release = {
    url:              string;
    assets_url:       string;
    upload_url:       string;
    html_url:         string;
    id:               number;
    author:           Author;
    node_id:          string;
    tag_name:         string;
    target_commitish: string;
    name:             string;
    draft:            boolean;
    prerelease:       boolean;
    created_at:       string;
    published_at:     string;
    assets:           Asset[];
    tarball_url:      string;
    zipball_url:      string;
    body:             string;
    reactions?:       Reactions;
}

export type Asset = {
    url:                  string;
    id:                   number;
    node_id:              string;
    name:                 string;
    label:                null;
    uploader:             Author;
    content_type:         string;
    state:                string;
    size:                 number;
    download_count:       number;
    created_at:           string;
    updated_at:           string;
    browser_download_url: string;
}

export type Author = {
    login:               string;
    id:                  number;
    node_id:             string;
    avatar_url:          string;
    gravatar_id:         string;
    url:                 string;
    html_url:            string;
    followers_url:       string;
    following_url:       string;
    gists_url:           string;
    starred_url:         string;
    subscriptions_url:   string;
    organizations_url:   string;
    repos_url:           string;
    events_url:          string;
    received_events_url: string;
    type:                string;
    site_admin:          boolean;
}

export type Reactions = {
    url:         string;
    total_count: number;
    "+1":        number;
    "-1":        number;
    laugh:       number;
    hooray:      number;
    confused:    number;
    heart:       number;
    rocket:      number;
    eyes:        number;
}


export type Current = {
    url: string;
    html_url: string;
    assets_url: string;
    upload_url: string;
    tarball_url: string;
    zipball_url: string;
    discussion_url: string;
    id: number;
    node_id: string;
    tag_name: string;
    target_commitish: string;
    name: string;
    body: string;
    draft: boolean;
    prerelease: boolean;
    created_at: string;
    published_at: string;
    author: {
      login: string;
      id: number;
      node_id: string;
      avatar_url: string;
      gravatar_id: string;
      url: string;
      html_url: string;
      followers_url: string;
      following_url: string;
      gists_url: string;
      starred_url: string;
      subscriptions_url: string;
      organizations_url: string;
      repos_url: string;
      events_url: string;
      received_events_url: string;
      type: string;
      site_admin: boolean;
    };
    assets: {
        url: string;
        browser_download_url: string;
        id: number;
        node_id: string;
        name: string;
        label: string;
        state: string;
        content_type: string;
        size: number;
        download_count: number;
        created_at: string;
        updated_at: string;
        uploader: {
            login: string;
            id: number;
            node_id: string;
            avatar_url: string;
            gravatar_id: string;
            url: string;
            html_url: string;
            followers_url: string;
            following_url: string;
            gists_url: string;
            starred_url: string;
            subscriptions_url: string;
            organizations_url: string;
            repos_url: string;
            events_url: string;
            received_events_url: string;
            type: string;
            site_admin: boolean;
        };
    }[];
  }