/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/check-user-exists/route";
exports.ids = ["app/api/auth/check-user-exists/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@prisma/client");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fcheck-user-exists%2Froute&page=%2Fapi%2Fauth%2Fcheck-user-exists%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fcheck-user-exists%2Froute.ts&appDir=%2FUsers%2Falbertalves%2Fcircle-version%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falbertalves%2Fcircle-version&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fcheck-user-exists%2Froute&page=%2Fapi%2Fauth%2Fcheck-user-exists%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fcheck-user-exists%2Froute.ts&appDir=%2FUsers%2Falbertalves%2Fcircle-version%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falbertalves%2Fcircle-version&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_albertalves_circle_version_src_app_api_auth_check_user_exists_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/check-user-exists/route.ts */ \"(rsc)/./src/app/api/auth/check-user-exists/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/check-user-exists/route\",\n        pathname: \"/api/auth/check-user-exists\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/check-user-exists/route\"\n    },\n    resolvedPagePath: \"/Users/albertalves/circle-version/src/app/api/auth/check-user-exists/route.ts\",\n    nextConfigOutput,\n    userland: _Users_albertalves_circle_version_src_app_api_auth_check_user_exists_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGY2hlY2stdXNlci1leGlzdHMlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZjaGVjay11c2VyLWV4aXN0cyUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZjaGVjay11c2VyLWV4aXN0cyUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFsYmVydGFsdmVzJTJGY2lyY2xlLXZlcnNpb24lMkZzcmMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGYWxiZXJ0YWx2ZXMlMkZjaXJjbGUtdmVyc2lvbiZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDNkI7QUFDMUc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9hbGJlcnRhbHZlcy9jaXJjbGUtdmVyc2lvbi9zcmMvYXBwL2FwaS9hdXRoL2NoZWNrLXVzZXItZXhpc3RzL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL2NoZWNrLXVzZXItZXhpc3RzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9jaGVjay11c2VyLWV4aXN0c1wiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC9jaGVjay11c2VyLWV4aXN0cy9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9hbGJlcnRhbHZlcy9jaXJjbGUtdmVyc2lvbi9zcmMvYXBwL2FwaS9hdXRoL2NoZWNrLXVzZXItZXhpc3RzL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fcheck-user-exists%2Froute&page=%2Fapi%2Fauth%2Fcheck-user-exists%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fcheck-user-exists%2Froute.ts&appDir=%2FUsers%2Falbertalves%2Fcircle-version%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falbertalves%2Fcircle-version&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(rsc)/./src/app/api/auth/check-user-exists/route.ts":
/*!*****************************************************!*\
  !*** ./src/app/api/auth/check-user-exists/route.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\nasync function POST(request) {\n    try {\n        const { email } = await request.json();\n        if (!email || !email.includes('@')) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Valid email is required'\n            }, {\n                status: 400\n            });\n        }\n        // Check if user exists\n        const existingUser = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.user.findUnique({\n            where: {\n                email\n            }\n        });\n        if (!existingUser) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'User not found'\n            }, {\n                status: 404\n            });\n        }\n        // Don't return user details for security, just confirm existence\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            exists: true\n        });\n    } catch (error) {\n        console.error('Error checking user:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to check user'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL2NoZWNrLXVzZXItZXhpc3RzL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEyQztBQUNMO0FBRS9CLGVBQWVFLEtBQUtDLE9BQWdCO0lBQ3pDLElBQUk7UUFDRixNQUFNLEVBQUVDLEtBQUssRUFBRSxHQUFHLE1BQU1ELFFBQVFFLElBQUk7UUFFcEMsSUFBSSxDQUFDRCxTQUFTLENBQUNBLE1BQU1FLFFBQVEsQ0FBQyxNQUFNO1lBQ2xDLE9BQU9OLHFEQUFZQSxDQUFDSyxJQUFJLENBQUM7Z0JBQUVFLE9BQU87WUFBMEIsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQy9FO1FBRUEsdUJBQXVCO1FBQ3ZCLE1BQU1DLGVBQWUsTUFBTVIsK0NBQU1BLENBQUNTLElBQUksQ0FBQ0MsVUFBVSxDQUFDO1lBQ2hEQyxPQUFPO2dCQUFFUjtZQUFNO1FBQ2pCO1FBRUEsSUFBSSxDQUFDSyxjQUFjO1lBQ2pCLE9BQU9ULHFEQUFZQSxDQUFDSyxJQUFJLENBQUM7Z0JBQUVFLE9BQU87WUFBaUIsR0FBRztnQkFBRUMsUUFBUTtZQUFJO1FBQ3RFO1FBRUEsaUVBQWlFO1FBQ2pFLE9BQU9SLHFEQUFZQSxDQUFDSyxJQUFJLENBQUM7WUFBRVEsUUFBUTtRQUFLO0lBQzFDLEVBQUUsT0FBT04sT0FBTztRQUNkTyxRQUFRUCxLQUFLLENBQUMsd0JBQXdCQTtRQUN0QyxPQUFPUCxxREFBWUEsQ0FBQ0ssSUFBSSxDQUFDO1lBQUVFLE9BQU87UUFBdUIsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDNUU7QUFDRiIsInNvdXJjZXMiOlsiL1VzZXJzL2FsYmVydGFsdmVzL2NpcmNsZS12ZXJzaW9uL3NyYy9hcHAvYXBpL2F1dGgvY2hlY2stdXNlci1leGlzdHMvcm91dGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgcHJpc21hIH0gZnJvbSAnQC9saWIvcHJpc21hJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIFBPU1QocmVxdWVzdDogUmVxdWVzdCkge1xuICB0cnkge1xuICAgIGNvbnN0IHsgZW1haWwgfSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuXG4gICAgaWYgKCFlbWFpbCB8fCAhZW1haWwuaW5jbHVkZXMoJ0AnKSkge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdWYWxpZCBlbWFpbCBpcyByZXF1aXJlZCcgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBpZiB1c2VyIGV4aXN0c1xuICAgIGNvbnN0IGV4aXN0aW5nVXNlciA9IGF3YWl0IHByaXNtYS51c2VyLmZpbmRVbmlxdWUoe1xuICAgICAgd2hlcmU6IHsgZW1haWwgfSxcbiAgICB9KTtcblxuICAgIGlmICghZXhpc3RpbmdVc2VyKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ1VzZXIgbm90IGZvdW5kJyB9LCB7IHN0YXR1czogNDA0IH0pO1xuICAgIH1cblxuICAgIC8vIERvbid0IHJldHVybiB1c2VyIGRldGFpbHMgZm9yIHNlY3VyaXR5LCBqdXN0IGNvbmZpcm0gZXhpc3RlbmNlXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXhpc3RzOiB0cnVlIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGNoZWNraW5nIHVzZXI6JywgZXJyb3IpO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRmFpbGVkIHRvIGNoZWNrIHVzZXInIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJQT1NUIiwicmVxdWVzdCIsImVtYWlsIiwianNvbiIsImluY2x1ZGVzIiwiZXJyb3IiLCJzdGF0dXMiLCJleGlzdGluZ1VzZXIiLCJ1c2VyIiwiZmluZFVuaXF1ZSIsIndoZXJlIiwiZXhpc3RzIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/check-user-exists/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/prisma.ts":
/*!***************************!*\
  !*** ./src/lib/prisma.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n\n// Evita múltiplas instâncias do Prisma Client em desenvolvimento\nconst prismaClientSingleton = ()=>{\n    return new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient();\n};\n// Verifica se estamos no lado do servidor\nconst isServer = \"undefined\" === 'undefined';\n// Só inicializa o Prisma no lado do servidor\nconst prisma = isServer ? globalThis.prisma ?? prismaClientSingleton() : null;\n// Mantém a instância do Prisma em desenvolvimento para hot-reloading\nif ( true && isServer) {\n    globalThis.prisma = prisma;\n}\n\n// Teste a conexão apenas no lado do servidor durante inicialização\nif (isServer) {\n// Opcional: Você pode descomentar isso para testar a conexão durante a inicialização\n// prisma.$connect()\n//   .then(() => console.log('Conectado ao banco de dados'))\n//   .catch((error) => console.error('Erro ao conectar ao banco de dados:', error))\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL3ByaXNtYS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7QUFBNkM7QUFFN0MsaUVBQWlFO0FBQ2pFLE1BQU1DLHdCQUF3QjtJQUM1QixPQUFPLElBQUlELHdEQUFZQTtBQUN6QjtBQU1BLDBDQUEwQztBQUMxQyxNQUFNRSxXQUFXLGdCQUFrQjtBQUVuQyw2Q0FBNkM7QUFDN0MsTUFBTUMsU0FBU0QsV0FBWUUsV0FBV0QsTUFBTSxJQUFJRiwwQkFBNEI7QUFFNUUscUVBQXFFO0FBQ3JFLElBQUlJLEtBQXFDLElBQUlILFVBQVU7SUFDckRFLFdBQVdELE1BQU0sR0FBR0E7QUFDdEI7QUFFaUI7QUFFakIsbUVBQW1FO0FBQ25FLElBQUlELFVBQVU7QUFDWixxRkFBcUY7QUFDckYsb0JBQW9CO0FBQ3BCLDREQUE0RDtBQUM1RCxtRkFBbUY7QUFDckYiLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGJlcnRhbHZlcy9jaXJjbGUtdmVyc2lvbi9zcmMvbGliL3ByaXNtYS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCdcblxuLy8gRXZpdGEgbcO6bHRpcGxhcyBpbnN0w6JuY2lhcyBkbyBQcmlzbWEgQ2xpZW50IGVtIGRlc2Vudm9sdmltZW50b1xuY29uc3QgcHJpc21hQ2xpZW50U2luZ2xldG9uID0gKCkgPT4ge1xuICByZXR1cm4gbmV3IFByaXNtYUNsaWVudCgpXG59XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgdmFyIHByaXNtYTogdW5kZWZpbmVkIHwgUmV0dXJuVHlwZTx0eXBlb2YgcHJpc21hQ2xpZW50U2luZ2xldG9uPlxufVxuXG4vLyBWZXJpZmljYSBzZSBlc3RhbW9zIG5vIGxhZG8gZG8gc2Vydmlkb3JcbmNvbnN0IGlzU2VydmVyID0gdHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCdcblxuLy8gU8OzIGluaWNpYWxpemEgbyBQcmlzbWEgbm8gbGFkbyBkbyBzZXJ2aWRvclxuY29uc3QgcHJpc21hID0gaXNTZXJ2ZXIgPyAoZ2xvYmFsVGhpcy5wcmlzbWEgPz8gcHJpc21hQ2xpZW50U2luZ2xldG9uKCkpIDogKG51bGwgYXMgYW55KVxuXG4vLyBNYW50w6ltIGEgaW5zdMOibmNpYSBkbyBQcmlzbWEgZW0gZGVzZW52b2x2aW1lbnRvIHBhcmEgaG90LXJlbG9hZGluZ1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgJiYgaXNTZXJ2ZXIpIHtcbiAgZ2xvYmFsVGhpcy5wcmlzbWEgPSBwcmlzbWFcbn1cblxuZXhwb3J0IHsgcHJpc21hIH1cblxuLy8gVGVzdGUgYSBjb25leMOjbyBhcGVuYXMgbm8gbGFkbyBkbyBzZXJ2aWRvciBkdXJhbnRlIGluaWNpYWxpemHDp8Ojb1xuaWYgKGlzU2VydmVyKSB7XG4gIC8vIE9wY2lvbmFsOiBWb2PDqiBwb2RlIGRlc2NvbWVudGFyIGlzc28gcGFyYSB0ZXN0YXIgYSBjb25leMOjbyBkdXJhbnRlIGEgaW5pY2lhbGl6YcOnw6NvXG4gIC8vIHByaXNtYS4kY29ubmVjdCgpXG4gIC8vICAgLnRoZW4oKCkgPT4gY29uc29sZS5sb2coJ0NvbmVjdGFkbyBhbyBiYW5jbyBkZSBkYWRvcycpKVxuICAvLyAgIC5jYXRjaCgoZXJyb3IpID0+IGNvbnNvbGUuZXJyb3IoJ0Vycm8gYW8gY29uZWN0YXIgYW8gYmFuY28gZGUgZGFkb3M6JywgZXJyb3IpKVxufSJdLCJuYW1lcyI6WyJQcmlzbWFDbGllbnQiLCJwcmlzbWFDbGllbnRTaW5nbGV0b24iLCJpc1NlcnZlciIsInByaXNtYSIsImdsb2JhbFRoaXMiLCJwcm9jZXNzIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fcheck-user-exists%2Froute&page=%2Fapi%2Fauth%2Fcheck-user-exists%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fcheck-user-exists%2Froute.ts&appDir=%2FUsers%2Falbertalves%2Fcircle-version%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falbertalves%2Fcircle-version&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();