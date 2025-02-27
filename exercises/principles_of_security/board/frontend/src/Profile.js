import './App.css';

function Profile() {
  return (
    <section className="profile-wrap">
        <div className="profile">
            <div className="pic">
                <img src="sw.png"></img>
                <span className="account-name">Christian Whale </span>
            </div>
            <div className="permissions">Permissions Role: 'Manager'</div>
        </div>
    </section>
  );
}

export default Profile
