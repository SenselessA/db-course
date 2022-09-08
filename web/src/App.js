import './App.css';
import Main from "./modules/main";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

function App() {
  return (
      <QueryClientProvider client={queryClient}>
          <div className={'bg-zinc-200'}>
            <Main />
          </div>
        <ReactQueryDevtools />
      </QueryClientProvider>
  );
}

export default App;
