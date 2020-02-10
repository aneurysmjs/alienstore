import { combineReducers, createStore } from 'redux';
import React, { useState, useEffect } from 'react';
import { useStore } from 'react-redux';

/* eslint-disable @typescript-eslint/ban-ts-ignore */
function manager(initialReducers) {
    const fallback = () => ({});
    let dispatch = null;
    const reducerMap = initialReducers ? { ...initialReducers } : {};
    // @ts-ignore "combineReducers" doesn't have that overload match
    let combinedReducer = initialReducers ? combineReducers(reducerMap) : fallback;
    let keysToRemove = [];
    function setDispatch(storeDispatch) {
        dispatch = storeDispatch;
    }
    function getReducerMap() {
        return reducerMap;
    }
    function injectReducers(key, reducer) {
        if (!key || reducerMap[key]) {
            return;
        }
        reducerMap[key] = reducer;
        // @ts-ignore "combineReducers" doesn't have that overload match
        combinedReducer = combineReducers(reducerMap);
        if (dispatch) {
            dispatch({ type: '@@ALIEN_STORE/RELOAD' });
        }
    }
    function removeReducers(key) {
        if (!key || !reducerMap[key]) {
            return;
        }
        delete reducerMap[key];
        keysToRemove.push(key);
        // @ts-ignore "combineReducers" doesn't have that overload match
        combinedReducer = combineReducers(reducerMap);
    }
    // this is what we give to create the Redux store
    function rootReducer(state, action) {
        let tempState = state;
        if (keysToRemove.length > 0) {
            tempState = { ...state };
            // eslint-disable-next-line no-restricted-syntax
            for (let i = 0; i < keysToRemove.length; i += 1) {
                delete tempState[keysToRemove[i]];
            }
            keysToRemove = [];
        }
        // Delegate to the combined reducer
        return combinedReducer(state, action);
    }
    return {
        getReducerMap,
        injectReducers,
        removeReducers,
        rootReducer,
        setDispatch,
    };
}

function alien(initialReducer, preloadedState) {
    const alienManager = manager(initialReducer);
    const store = createStore(alienManager.rootReducer, preloadedState);
    alienManager.setDispatch(store.dispatch);
    store.alienManager = alienManager;
    return store;
}

function errorHandler(errorOrObj) {
    if (errorOrObj) {
        // rejection from `import()` for some reason is not and instance of Error
        // that's why the "Object.getPrototypeOf(errorOrObj).name"
        if (errorOrObj instanceof Error || Object.getPrototypeOf(errorOrObj).name === 'Error') {
            throw new Error(`useAlienModule ${errorOrObj}`);
        }
    }
    return errorOrObj;
}
function useAlien(reduxImports, 
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function
cb = () => { }) {
    const store = useStore();
    const { alienManager: { injectReducers, rootReducer }, } = store;
    const [alien, setAlien] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const promises = reduxImports.map(reduxImport => reduxImport());
                const reduxModules = await Promise.all(promises);
                const result = reduxModules.map(({ id, reducers, ...rest }) => {
                    if (id == null || id === '') {
                        throw new Error('Redux Module has no id');
                    }
                    if (reducers == null || reducers === undefined || Object.keys(reducers).length === 0) {
                        throw new Error('Redux Module has no reducers');
                    }
                    // is safe here to iterate reducers's keys for reducer injection
                    Object.keys(reducers).forEach(key => {
                        injectReducers(key, reducers[key]);
                    });
                    store.replaceReducer(rootReducer);
                    return {
                        id,
                        ...rest,
                    };
                });
                setAlien([...alien, ...result]);
            }
            catch (err) {
                setAlien(err);
            }
        })();
        return () => cb();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return errorHandler(alien);
}

function WithAlien(Component, reduxModules) {
    const alienModules = useAlien(reduxModules);
    if (alienModules.length > 0) {
        return React.createElement(Component, Object.assign({}, { modules: alienModules }));
    }
    return null;
}

export { alien, useAlien, WithAlien as withAlien };
