import { useState, useEffect } from "react";
import { catchErrors } from "../utils";
import {
  getCurrentUserProfile,
  getCurrentUserPlaylists,
  getTopArtists,
  getTopTracks,
} from "../spotify";
import {
  SectionWrapper,
  ArtistsGrid,
  TrackList,
  PlaylistsGrid,
  Loader,
} from "../components";
import { StyledHeader } from "../styles";
import profileImage from '../assets/emmanuel.jpg'

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [playlists, setPlaylists] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [topTracks, setTopTracks] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getCurrentUserProfile();
      setProfile(data);
      const userPlaylists = await getCurrentUserPlaylists();
      setPlaylists(userPlaylists.data);
      const userTopArtist = await getTopArtists();
      setTopArtists(userTopArtist.data);
      const userTopTracks = await getTopTracks();
      setTopTracks(userTopTracks.data);
    };

    catchErrors(fetchData());
  }, []);

  return (
    <>
      {profile && (
        <>
          <StyledHeader type="user">
            <div className="header__inner">
              <img
                className="header__img"
                style={{ width: "150px", height: "150px", borderRadius: "50%" }}
                src={profileImage}
                alt="Avatar"
              />
              <div>
                <div className="header__overline">Profile</div>
                <h1 className="header__name">{profile.display_name}</h1>
                <p className="header__meta">
                  {playlists && (
                    <span>
                      {playlists.total} Playlist
                      {playlists.total !== 1 ? "s" : ""}
                    </span>
                  )}
                  <span>
                    {profile.followers.total || 22} Follower
                    {profile.followers.total !== 1 ? "s" : ""}
                  </span>
                </p>
              </div>
            </div>
          </StyledHeader>
          {topArtists && topTracks && playlists ? (
            <main>
              <SectionWrapper
                title="Top artists this month"
                seeAllLink="/top-artists"
              >
                <ArtistsGrid artists={topArtists.items.slice(0, 10)} />
              </SectionWrapper>

              <SectionWrapper
                title="Top tracks this month"
                seeAllLink="/top-tracks"
              >
                <TrackList tracks={topTracks.items.slice(0, 10)} />
              </SectionWrapper>

              <SectionWrapper title="Playlists" seeAllLink="/playlists">
                <PlaylistsGrid playlists={playlists.items.slice(0, 10)} />
              </SectionWrapper>
            </main>
          ) : (
            <Loader />
          )}
        </>
      )}
    </>
  );
};

export default Profile;
