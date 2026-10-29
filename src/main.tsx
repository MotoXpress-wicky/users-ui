// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './shop.css'
import { AppProviders } from './app/AppProviders'
import { setupInterceptors } from './app/setupInterceptors'

setupInterceptors()

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <AppProviders/>
//   </StrictMode>,
// )
createRoot(document.getElementById('root')!).render(

    <AppProviders/>,
)
