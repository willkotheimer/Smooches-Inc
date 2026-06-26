import UserJoin from '../Components/UserJoin';

export default function LinkAccountsPage() {
  return (
    <div className="linkedAccountsPage d-flex justify-content-center">
      <div className="leftSide">
        <div>
          <h3>User Connections:</h3>
          <UserJoin />
        </div>
      </div>
    </div>
  );
}
