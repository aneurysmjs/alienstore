import{combineReducers as e,createStore as r}from"redux";import t,{useState as n,useEffect as o}from"react";import{useStore as c}from"react-redux";function u(t,n){const o=function(r){let t=null;const n=r?{...r}:{};let o=r?e(n):()=>({}),c=[];return{getReducerMap:function(){return n},injectReducers:function(r,c){r&&!n[r]&&(n[r]=c,o=e(n),t&&t({type:"@@ALIEN_STORE/RELOAD"}))},removeReducers:function(r){r&&n[r]&&(delete n[r],c.push(r),o=e(n))},rootReducer:function(e,r){let t=e;if(c.length>0){t={...e};for(let e=0;c.length>e;e+=1)delete t[c[e]];c=[]}return o(e,r)},setDispatch:function(e){t=e}}}(t),c=r(o.rootReducer,n);return o.setDispatch(c.dispatch),c.alienManager=o,c}function i(e,r=(()=>{})){const t=c(),{alienManager:{injectReducers:u,rootReducer:i}}=t,[l,a]=n([]);return o(()=>((async()=>{try{const r=e.map(e=>e()),n=(await Promise.all(r)).map(({id:e,reducers:r,...n})=>{if(null==e||""===e)throw Error("Redux Module has no id");if(null==r||void 0===r||0===Object.keys(r).length)throw Error("Redux Module has no reducers");return Object.keys(r).forEach(e=>{u(e,r[e])}),t.replaceReducer(i),{id:e,...n}});a([...l,...n])}catch(e){a(e)}})(),()=>r()),[]),function(e){if(e&&(e instanceof Error||"Error"===Object.getPrototypeOf(e).name))throw Error(`useAlienModule ${e}`);return e}(l)}function l(e,r){const n=i(r);return n.length>0?t.createElement(e,Object.assign({},{modules:n})):null}export{u as alien,i as useAlien,l as withAlien};