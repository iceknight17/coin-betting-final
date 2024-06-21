import tonMarkBlue from './assets/toncoin-ton-logo-blue.svg'
import tonMarkRed from './assets/toncoin-ton-logo-red.svg'
import coinHeadImg from './assets/coin-front.png'
import coinTailImg from './assets/coin-back.png'
import { Menu, MenuButton, MenuItem, MenuItems, Transition, Switch } from '@headlessui/react'
import { useEffect, useRef, useState } from "react";
import Swal from 'sweetalert2';
import { useUserStore } from "./store";
import UserNameAvatar from "./components/UserNameAvatar";
import WebApp from '@twa-dev/sdk'

function App() {
  const {currentUser, is_test_mode, setMode} = useUserStore();
  const HEAD: string = 'head', TAIL: string = 'tail';
  const START = 'start', MAIN = 'main';
  const [currentTab, setCurrentTab] = useState(START); // loading: loading balance, start: select side of coin, main: betting tab
  const [betOn, setBetOn] = useState('');
  const [betAmount, setBetAmount] = useState('');
  const [onBetting, setOnBetting] = useState(false);
  const coinRef = useRef(null);
  const MIN = 200, MAX = 100000;

  useEffect(() => {
    console.log('WebApp.initData', WebApp.initData);
  }, [WebApp.initData]);
  
  const onStartBetting = (type: string) => {
    setBetOn(type);
    setCurrentTab(MAIN);
  }

  const getBettingResult = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });
    if(response.ok) {
      const result = await response.json();
      console.log('result', result);
      return {
        status: 'success',
        result: true
      };
    }
    return {
      status: 'failed',
      msg: 'Failed in get betting result!'
    };
  }

  const flipCoin = async () => {
    if(!onBetting && betAmount && betOn && parseInt(betAmount) >= MIN && parseInt(betAmount) <= MAX && currentUser && (is_test_mode ? currentUser?.red_stars! : currentUser?.blue_stars!) > parseInt(betAmount)) {
      setOnBetting(true);
      
      const coin: any = coinRef.current;
      coin.style.animation = 'none';
      let response = await getBettingResult();
      if(response.status != 'success') {
        return await Swal.fire({
          title: 'Error!',
          text: response.msg,
          icon: 'error',
          confirmButtonText: 'Confirm'
        });
      }
      const { result } = response;
      coin.style.animation = `spin-${result ? betOn : [HEAD, TAIL].find(i => i != betOn)}s 5s forwards`;
      setTimeout(async () => {
        setOnBetting(false);
        if(result) {
          await Swal.fire({
            title: 'Success!',
            text: `You win!`,
            icon: 'success',
            confirmButtonText: 'Confirm'
          });
        }else{
          await Swal.fire({
            title: 'Failed!',
            text: `You lose!`,
            icon: 'error',
            confirmButtonText: 'Confirm'
          });
        }
        setCurrentTab(START);
        setBetAmount('');
        setBetOn('');
      }, 5000);
    }else{
      Swal.fire({
        title: 'Error!',
        text: `Failed to betting! Please check field.`,
        icon: 'error',
        confirmButtonText: 'Confirm'
      });
    }
  }

  return (
    <>
    <div className="w-full h-screen flex flex-col p-6 z-10 relative">
      <div className="w-full mt-2 flex flex-col flex-1">
        <div className="w-full flex justify-between items-center">
          <div className="h-8 bg-gray-800 text-white rounded-lg pl-4 pr-5 w-max flex flex-row items-center gap-3 relative">
            {is_test_mode ?
              <span className="leading-8 text-xl font-medium">{currentUser?.red_stars.toLocaleString()}</span> :
              <span className="leading-8 text-xl font-medium">{currentUser?.blue_stars.toLocaleString()}</span>
            }
            <img
              src={is_test_mode ? tonMarkRed : tonMarkBlue}
              className="w-6 h-6"
              alt="ton coin mark"
            />
            <div onClick={() => {setMode(!is_test_mode)}} className='w-5 h-5 absolute rounded-full bg-white text-black insert-bottom-right flex justify-center items-center'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-14px h-14px">
                <path d="M370.7 133.3C339.5 104 298.9 88 255.8 88c-77.5.1-144.3 53.2-162.8 126.9-1.3 5.4-6.1 9.2-11.7 9.2H24.1c-7.5 0-13.2-6.8-11.8-14.2C33.9 94.9 134.8 8 256 8c66.4 0 126.8 26.1 171.3 68.7L463 41c15.1-15.1 41-4.4 41 16.9V192c0 13.3-10.7 24-24 24H345.9c-21.4 0-32.1-25.9-17-41l41.8-41.7zM32 296h134.1c21.4 0 32.1 25.9 17 41l-41.8 41.8c31.3 29.3 71.8 45.3 114.9 45.3C333.6 424 400.5 371 419 297.3c1.3-5.4 6.1-9.2 11.7-9.2H488c7.5 0 13.2 6.8 11.8 14.2C478.1 417.1 377.2 504 256 504c-66.4 0-126.8-26.1-171.3-68.7L49 471c-15.1 15.1-41 4.4-41-16.9V320c0-13.3 10.7-24 24-24z" />
              </svg>
            </div>
          </div>
          <Menu>
            <MenuButton>
              <UserNameAvatar name={currentUser?.fullname!} />
            </MenuButton>
            <Transition
              enter="duration-200 ease-out"
              enterFrom="scale-95 opacity-0"
              enterTo="scale-100 opacity-100"
              leave="duration-300 ease-out"
              leaveFrom="scale-100 opacity-100"
              leaveTo="scale-95 opacity-0"
            >
              <MenuItems anchor="bottom end" className="block max-w-sm p-3 mt-1 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 z-10 text-gray-800">
                <MenuItem as="div" className="flex justify-center gap-2 py-2">
                  {is_test_mode ? 'Test' : 'Real'} Mode
                  <Switch
                    checked={is_test_mode}
                    onChange={() => {setMode(!is_test_mode)}}
                    className="group inline-flex h-6 w-11 items-center border border-gray-300 rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                  >
                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                  </Switch>
                </MenuItem>
                <MenuItem as="div" className="py-2">
                  Active Point {currentUser?.active_point}
                </MenuItem>
                <MenuItem as="div" className="py-2">
                  View History
                </MenuItem>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
        {currentTab == START &&
          <div className="flex-1 flex flex-col-reverse pb-2">
            <div className="w-full flex items-center gap-12 justify-center mb-12">
              <img
                src={coinHeadImg}
                onClick={() => {onStartBetting(HEAD)}}
                className="btn-head w-32 h-32 cursor-pointer rounded-full"
                alt="ton coin mark"
              />
              <img
                src={coinTailImg}
                onClick={() => {onStartBetting(TAIL)}}
                className="btn-tail w-32 h-32 cursor-pointer rounded-full"
                alt="ton coin mark"
              />
            </div>
            <div className="w-full mb-80">
              <p className="mb-0 text-gray-900 text-4xl font-medium text-center">
                Pick a side
              </p>
            </div>
          </div>
        }
        {currentTab == MAIN &&
          <div className="flex-1 flex flex-col-reverse pb-2">
            <div className="w-full flex items-center gap-4">
              <button
                type="button"
                onClick={flipCoin}
                id="bet_btn"
                className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none font-medium rounded-lg text-xl px-5 py-3 flex-1 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700"
              >
                Bet on {betOn}s
              </button>
            </div>
            <div className="w-full">
              <div className="w-full flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {setBetAmount(MIN.toString())}}
                  id="min_amount_btn"
                  className="h-8 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 flex justify-center items-center"
                >
                  Min
                </button>
                <input
                  type="number"
                  value={betAmount}
                  className="h-10 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500"
                  onChange={(e) => { setBetAmount(e.target.value) }}
                  placeholder="500"
                />
                <button
                  type="button"
                  onClick={() => {setBetAmount(MAX.toString())}}
                  id="max_amount_btn"
                  className="h-8 text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 flex justify-center items-center"
                >
                  Max
                </button>
              </div>
              <div className="text-center text-white mt-2 mb-8">
                Min {MIN.toLocaleString()} - Max {MAX.toLocaleString()}
              </div>
            </div>
            <div className="w-full flex items-center gap-12 justify-center mb-12">
              <div className="coin w-32 h-32" id='coin' ref={coinRef}>
                <div className="heads">
                  <img
                    src={coinHeadImg}
                    className="w-full h-full cursor-pointer rounded-full"
                  />
                </div>
                <div className="tails">
                  <img
                    src={coinTailImg}
                    className="w-full h-full cursor-pointer rounded-full"
                  />
                </div>
              </div>
            </div>
            <div className="w-full mb-40">
              <p className="mb-0 text-gray-900 text-4xl font-medium text-center">
                Place your bet
              </p>
            </div>
          </div>
        }
      </div>
    </div>
  </>
  );
}

export default App;
