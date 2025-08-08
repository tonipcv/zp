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
exports.id = "app/api/auth/verify-login-code/route";
exports.ids = ["app/api/auth/verify-login-code/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fverify-login-code%2Froute&page=%2Fapi%2Fauth%2Fverify-login-code%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fverify-login-code%2Froute.ts&appDir=%2FUsers%2Falbertalves%2Fcircle-version%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falbertalves%2Fcircle-version&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fverify-login-code%2Froute&page=%2Fapi%2Fauth%2Fverify-login-code%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fverify-login-code%2Froute.ts&appDir=%2FUsers%2Falbertalves%2Fcircle-version%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falbertalves%2Fcircle-version&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_albertalves_circle_version_src_app_api_auth_verify_login_code_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/verify-login-code/route.ts */ \"(rsc)/./src/app/api/auth/verify-login-code/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/verify-login-code/route\",\n        pathname: \"/api/auth/verify-login-code\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/verify-login-code/route\"\n    },\n    resolvedPagePath: \"/Users/albertalves/circle-version/src/app/api/auth/verify-login-code/route.ts\",\n    nextConfigOutput,\n    userland: _Users_albertalves_circle_version_src_app_api_auth_verify_login_code_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGdmVyaWZ5LWxvZ2luLWNvZGUlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkZ2ZXJpZnktbG9naW4tY29kZSUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkZ2ZXJpZnktbG9naW4tY29kZSUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmFsYmVydGFsdmVzJTJGY2lyY2xlLXZlcnNpb24lMkZzcmMlMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGYWxiZXJ0YWx2ZXMlMkZjaXJjbGUtdmVyc2lvbiZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBK0Y7QUFDdkM7QUFDcUI7QUFDNkI7QUFDMUc7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9Vc2Vycy9hbGJlcnRhbHZlcy9jaXJjbGUtdmVyc2lvbi9zcmMvYXBwL2FwaS9hdXRoL3ZlcmlmeS1sb2dpbi1jb2RlL3JvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL3ZlcmlmeS1sb2dpbi1jb2RlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC92ZXJpZnktbG9naW4tY29kZVwiLFxuICAgICAgICBmaWxlbmFtZTogXCJyb3V0ZVwiLFxuICAgICAgICBidW5kbGVQYXRoOiBcImFwcC9hcGkvYXV0aC92ZXJpZnktbG9naW4tY29kZS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi9Vc2Vycy9hbGJlcnRhbHZlcy9jaXJjbGUtdmVyc2lvbi9zcmMvYXBwL2FwaS9hdXRoL3ZlcmlmeS1sb2dpbi1jb2RlL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmZ1bmN0aW9uIHBhdGNoRmV0Y2goKSB7XG4gICAgcmV0dXJuIF9wYXRjaEZldGNoKHtcbiAgICAgICAgd29ya0FzeW5jU3RvcmFnZSxcbiAgICAgICAgd29ya1VuaXRBc3luY1N0b3JhZ2VcbiAgICB9KTtcbn1cbmV4cG9ydCB7IHJvdXRlTW9kdWxlLCB3b3JrQXN5bmNTdG9yYWdlLCB3b3JrVW5pdEFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fverify-login-code%2Froute&page=%2Fapi%2Fauth%2Fverify-login-code%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fverify-login-code%2Froute.ts&appDir=%2FUsers%2Falbertalves%2Fcircle-version%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falbertalves%2Fcircle-version&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

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

/***/ "(rsc)/./src/app/api/auth/verify-login-code/route.ts":
/*!*****************************************************!*\
  !*** ./src/app/api/auth/verify-login-code/route.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./src/lib/prisma.ts\");\n\n\nasync function POST(request) {\n    try {\n        const { email, code } = await request.json();\n        if (!email || !code) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Email and verification code are required'\n            }, {\n                status: 400\n            });\n        }\n        // Find the verification code in the database\n        const verificationRecord = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.loginVerificationCode.findFirst({\n            where: {\n                email,\n                code,\n                expiresAt: {\n                    gt: new Date()\n                }\n            }\n        });\n        if (!verificationRecord) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: 'Invalid or expired verification code'\n            }, {\n                status: 400\n            });\n        }\n        // Mark the code as verified\n        await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.loginVerificationCode.update({\n            where: {\n                id: verificationRecord.id\n            },\n            data: {\n                verified: true\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            success: true\n        });\n    } catch (error) {\n        console.error('Error verifying login code:', error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: 'Failed to verify code'\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL3ZlcmlmeS1sb2dpbi1jb2RlL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUEyQztBQUNMO0FBRS9CLGVBQWVFLEtBQUtDLE9BQWdCO0lBQ3pDLElBQUk7UUFDRixNQUFNLEVBQUVDLEtBQUssRUFBRUMsSUFBSSxFQUFFLEdBQUcsTUFBTUYsUUFBUUcsSUFBSTtRQUUxQyxJQUFJLENBQUNGLFNBQVMsQ0FBQ0MsTUFBTTtZQUNuQixPQUFPTCxxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO2dCQUFFQyxPQUFPO1lBQTJDLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUNoRztRQUVBLDZDQUE2QztRQUM3QyxNQUFNQyxxQkFBcUIsTUFBTVIsK0NBQU1BLENBQUNTLHFCQUFxQixDQUFDQyxTQUFTLENBQUM7WUFDdEVDLE9BQU87Z0JBQ0xSO2dCQUNBQztnQkFDQVEsV0FBVztvQkFDVEMsSUFBSSxJQUFJQztnQkFDVjtZQUNGO1FBQ0Y7UUFFQSxJQUFJLENBQUNOLG9CQUFvQjtZQUN2QixPQUFPVCxxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO2dCQUFFQyxPQUFPO1lBQXVDLEdBQUc7Z0JBQUVDLFFBQVE7WUFBSTtRQUM1RjtRQUVBLDRCQUE0QjtRQUM1QixNQUFNUCwrQ0FBTUEsQ0FBQ1MscUJBQXFCLENBQUNNLE1BQU0sQ0FBQztZQUN4Q0osT0FBTztnQkFBRUssSUFBSVIsbUJBQW1CUSxFQUFFO1lBQUM7WUFDbkNDLE1BQU07Z0JBQUVDLFVBQVU7WUFBSztRQUN6QjtRQUVBLE9BQU9uQixxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1lBQUVjLFNBQVM7UUFBSztJQUMzQyxFQUFFLE9BQU9iLE9BQU87UUFDZGMsUUFBUWQsS0FBSyxDQUFDLCtCQUErQkE7UUFDN0MsT0FBT1AscURBQVlBLENBQUNNLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQXdCLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQzdFO0FBQ0YiLCJzb3VyY2VzIjpbIi9Vc2Vycy9hbGJlcnRhbHZlcy9jaXJjbGUtdmVyc2lvbi9zcmMvYXBwL2FwaS9hdXRoL3ZlcmlmeS1sb2dpbi1jb2RlL3JvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXNwb25zZSB9IGZyb20gJ25leHQvc2VydmVyJztcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gJ0AvbGliL3ByaXNtYSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBQT1NUKHJlcXVlc3Q6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB7IGVtYWlsLCBjb2RlIH0gPSBhd2FpdCByZXF1ZXN0Lmpzb24oKTtcblxuICAgIGlmICghZW1haWwgfHwgIWNvZGUpIHtcbiAgICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRW1haWwgYW5kIHZlcmlmaWNhdGlvbiBjb2RlIGFyZSByZXF1aXJlZCcgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICB9XG5cbiAgICAvLyBGaW5kIHRoZSB2ZXJpZmljYXRpb24gY29kZSBpbiB0aGUgZGF0YWJhc2VcbiAgICBjb25zdCB2ZXJpZmljYXRpb25SZWNvcmQgPSBhd2FpdCBwcmlzbWEubG9naW5WZXJpZmljYXRpb25Db2RlLmZpbmRGaXJzdCh7XG4gICAgICB3aGVyZToge1xuICAgICAgICBlbWFpbCxcbiAgICAgICAgY29kZSxcbiAgICAgICAgZXhwaXJlc0F0OiB7XG4gICAgICAgICAgZ3Q6IG5ldyBEYXRlKCksIC8vIENvZGUgbXVzdCBub3QgYmUgZXhwaXJlZFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGlmICghdmVyaWZpY2F0aW9uUmVjb3JkKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0ludmFsaWQgb3IgZXhwaXJlZCB2ZXJpZmljYXRpb24gY29kZScgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgICB9XG5cbiAgICAvLyBNYXJrIHRoZSBjb2RlIGFzIHZlcmlmaWVkXG4gICAgYXdhaXQgcHJpc21hLmxvZ2luVmVyaWZpY2F0aW9uQ29kZS51cGRhdGUoe1xuICAgICAgd2hlcmU6IHsgaWQ6IHZlcmlmaWNhdGlvblJlY29yZC5pZCB9LFxuICAgICAgZGF0YTogeyB2ZXJpZmllZDogdHJ1ZSB9LFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgc3VjY2VzczogdHJ1ZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdFcnJvciB2ZXJpZnlpbmcgbG9naW4gY29kZTonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6ICdGYWlsZWQgdG8gdmVyaWZ5IGNvZGUnIH0sIHsgc3RhdHVzOiA1MDAgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJQT1NUIiwicmVxdWVzdCIsImVtYWlsIiwiY29kZSIsImpzb24iLCJlcnJvciIsInN0YXR1cyIsInZlcmlmaWNhdGlvblJlY29yZCIsImxvZ2luVmVyaWZpY2F0aW9uQ29kZSIsImZpbmRGaXJzdCIsIndoZXJlIiwiZXhwaXJlc0F0IiwiZ3QiLCJEYXRlIiwidXBkYXRlIiwiaWQiLCJkYXRhIiwidmVyaWZpZWQiLCJzdWNjZXNzIiwiY29uc29sZSJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/verify-login-code/route.ts\n");

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2Fverify-login-code%2Froute&page=%2Fapi%2Fauth%2Fverify-login-code%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fverify-login-code%2Froute.ts&appDir=%2FUsers%2Falbertalves%2Fcircle-version%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Falbertalves%2Fcircle-version&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();