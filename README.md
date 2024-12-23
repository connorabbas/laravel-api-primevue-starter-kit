# Vue SPA w/ PrimeVue & Laravel Breeze API Stack
A [PrimeVue](https://primevue.org/) SPA starter kit meant for use with a [Laravel Breeze](https://laravel.com/docs/master/starter-kits#laravel-breeze) API stack backend.

An alternative to using the [Laravel, Inertia.js, & PrimeVue Starter Kit](https://github.com/connorabbas/laravel-inertia-primevue).

## Setup 
1. Clone the repo (or download the zip)
2. Create a new `.env` file in the root directory, reference the `.env.example` file for the vars/values
3. Create a [new Laravel application](https://laravel.com/docs/master/installation) 
4. Install [Laravel Breeze](https://laravel.com/docs/master/starter-kits#laravel-breeze-installation) using the [API Stack](https://laravel.com/docs/master/starter-kits#breeze-and-next) option
5. Setup necessary `.env` configuration values in the Laravel API project
    ```
    # Example implementation
    # Remember, your SPA and API must share the same top-level domain
    APP_URL=http://api.vue-spa.localhost # Match this value with VITE_API_BASE_URL in the Vue app
    FRONTEND_URL=http://vue-spa.localhost # Add app.frontend_url config entry as needed
    SANCTUM_STATEFUL_DOMAINS="vue-spa.localhost"
    SESSION_DOMAIN="vue-spa.localhost"
    ```
6. Setup additional routes and controllers for profile page in the Laravel API project:
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

## Theme
This starter kit provides a light/dark mode and custom theme functionality provided by the powerful PrimeVue theming system, using styled mode and custom design token values.

The starting point for customizing your theme will be the `theme-preset.js` file at the root of the project. To quickly change the look and feel of your theme, swap the [primary](https://primevue.org/theming/styled/#primary) values with a different set of [colors](https://primevue.org/theming/styled/#colors), change the [surface](https://primevue.org/theming/styled/#surface) `colorScheme` values (slate, gray, neutral, etc.), or completely change the [preset theme](https://primevue.org/theming/styled/#presets) (Aura used by default).

Please reference the [PrimeVue Styled Mode Docs](https://primevue.org/theming/styled/) to fully understand how this system works, and how to further customize your theme to make it your own.
