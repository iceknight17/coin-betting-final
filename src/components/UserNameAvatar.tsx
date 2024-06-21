import { generatePlaceholderName, generateRandomColorNumber } from "../utils";

export default ({name}: {name: string}) => {
    const userPlaceholder = generatePlaceholderName(name);
    let avatarColorNum = 0;
    if(localStorage.getItem('avatar-color')) {
        avatarColorNum = parseInt(localStorage.getItem('avatar-color')!);
    }else {
        avatarColorNum = generateRandomColorNumber();
        localStorage.setItem('avatar-color', avatarColorNum.toString());
    }
    const placeholderBackground = `hsl(${avatarColorNum}, 50% , 50%)`;
    return (
      <div
        className="user__placeholder cursor-pointer"
        style={{
          backgroundColor: placeholderBackground
        }}
      >
        {userPlaceholder}
      </div>
    );
};
