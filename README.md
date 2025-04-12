# PrimeVue SPA & Laravel API Starter Kit

![Static Badge](<https://img.shields.io/badge/Vue.js%20-%20v3.5%20-%20rgb(66%20184%20131)>) ![Static Badge](<https://img.shields.io/badge/PrimeVue%20-%20v4%20-%20rgb(16%20185%20129)>) ![Static Badge](https://img.shields.io/badge/Tailwind%20CSS%20-%20v4%20-%20%230284c7)

A [PrimeVue](https://primevue.org/) SPA starter kit meant for use with a [Laravel Breeze](https://github.com/laravel/breeze) API stack backend.

An alternative to using the [Laravel & PrimeVue (Inertia.js) Starter Kit](https://github.com/connorabbas/laravel-primevue-starter-kit).

## Setup

1. Clone the repo (or download the zip)
2. Create a new `.env` file in the root directory, reference the `.env.example` file for the vars/values
3. Create a [new Laravel application](https://laravel.com/docs/master/installation)
4. Install [Laravel Breeze](https://laravel.com/docs/11.x/starter-kits#laravel-breeze-installation) using the [API Stack](https://laravel.com/docs/11.x/starter-kits#breeze-and-next) option
5. Setup necessary `.env` configuration values in the Laravel API project
    ```
    # Example implementation
    # Remember, your SPA and API must share the same top-level domain
    APP_URL=http://api.vue-spa.localhost # Match this value with VITE_API_BASE_URL in the Vue app
    FRONTEND_URL=http://vue-spa.localhost # Add app.frontend_url config entry as needed
    SANCTUM_STATEFUL_DOMAINS="vue-spa.localhost"
    SESSION_DOMAIN="vue-spa.localhost"
    ```
6. Setup additional routes and controllers for profile settings in the Laravel API project:

    ```
    php artisan make:controller ProfileController
    ```

    ```php
    <?php

    namespace App\Http\Controllers;

    use App\Models\User;
    use Illuminate\Http\Request;
    use Illuminate\Http\Response;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Validation\Rule;
    use Illuminate\View\View;

    class ProfileController extends Controller
    {
        /**
        * Update the user's profile information.
        */
        public function update(Request $request): Response
        {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'string',
                    'lowercase',
                    'email',
                    'max:255',
                    Rule::unique(User::class)->ignore($request->user()->id),
                ],
            ]);

            $request->user()->fill($validated);

            if ($request->user()->isDirty('email')) {
                $request->user()->email_verified_at = null;
            }

            $request->user()->save();

            return response()->noContent();
        }

        /**
        * Delete the user's account.
        */
        public function destroy(Request $request): Response
        {
            $request->validate([
                'password' => ['required', 'current_password'],
            ]);

            $user = $request->user();

            Auth::logout();

            $user->delete();

            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return response()->noContent();
        }
    }

    ```

    ```
    php artisan make:controller Auth/PasswordController
    ```

    ```php
    <?php

    namespace App\Http\Controllers\Auth;

    use App\Http\Controllers\Controller;
    use Illuminate\Http\Request;
    use Illuminate\Http\Response;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\Support\Facades\Hash;
    use Illuminate\Validation\Rules\Password;

    class PasswordController extends Controller
    {
        /**
        * Update the user's password.
        */
        public function update(Request $request): Response
        {
            $validated = $request->validate([
                'current_password' => ['required', 'current_password'],
                'password' => ['required', Password::defaults(), 'confirmed'],
            ]);

            $request->user()->update([
                'password' => Hash::make($validated['password']),
            ]);

            if ($request->session()->has('password_hash_web')) {
                $user = Auth::user();
                $request->session()->forget('password_hash_web');
                Auth::login($user);
            }

            return response()->noContent();
        }
    }

    ```

    ```php
    Route::controller(App\Http\Controllers\ProfileController::class)
        ->middleware('auth')
        ->group(function () {
            Route::patch('/profile', 'update')->name('profile.update');
            Route::delete('/profile', 'destroy')->name('profile.destroy');
        });

    Route::put('password', [App\Http\Controllers\Auth\PasswordController::class, 'update'])
        ->middleware('auth')
        ->name('password.update');
    ```

## TypeScript

TypeScript is configured and ready for use if desired, but is not required.

## Theme

This starter kit features a built-in light/dark mode toggle along with a collection of custom theme presets built using the powerful **PrimeVue V4** theming system. It leverages styled mode and custom design token values to create flexible and cohesive UI designs.

### Prebuilt Theme Presets

The prebuilt theme presets are located in the `/src/theme` directory. Each preset offers a distinct visual style:

-   **noir**  
    A minimal, monochromatic theme that serves as the default style.

-   **bootstrap**  
    Emulates the familiar look and feel of [Bootstrap](https://getbootstrap.com/).

-   **breeze**  
    Captures the aesthetic of [Laravel Breeze](https://github.com/laravel/breeze).

-   **enterprise**  
    Provides a clean, no-nonsense corporate design.

### Customizing Your Own Theme

Creating your own theme preset is simple. You can:

-   Swap the [primary](https://primevue.org/theming/styled/#primary) values with a different set of [colors](https://primevue.org/theming/styled/#colors).
-   Adjust the `colorScheme` [surface](https://primevue.org/theming/styled/#surface) values (e.g., slate, gray, neutral).
-   Change the extended [preset theme](https://primevue.org/theming/styled/#presets).

For detailed guidance on customization, please refer to the [PrimeVue Styled Mode Docs](https://primevue.org/theming/styled/).

## PrimeVue v4 w/ Tailwind CSS

To clarify, Tailwind is **not** used for any component styling in this starter kit; instead, we use PrimeVue's styled mode with a custom theme preset implementation for component styling. Tailwind is applied solely for layout purposes **around** PrimeVue components and for minimal styling when needed.
