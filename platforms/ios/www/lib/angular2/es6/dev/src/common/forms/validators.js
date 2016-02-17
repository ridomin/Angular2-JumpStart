import { isBlank, isPresent, CONST_EXPR, isString } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/promise';
import { ObservableWrapper } from 'angular2/src/facade/async';
import { StringMapWrapper } from 'angular2/src/facade/collection';
import { OpaqueToken } from 'angular2/core';
/**
 * Providers for validators to be used for {@link Control}s in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * ### Example
 *
 * {@example core/forms/ts/ng_validators/ng_validators.ts region='ng_validators'}
 */
export const NG_VALIDATORS = CONST_EXPR(new OpaqueToken("NgValidators"));
/**
 * Providers for asynchronous validators to be used for {@link Control}s
 * in a form.
 *
 * Provide this using `multi: true` to add validators.
 *
 * See {@link NG_VALIDATORS} for more details.
 */
export const NG_ASYNC_VALIDATORS = CONST_EXPR(new OpaqueToken("NgAsyncValidators"));
/**
 * Provides a set of validators used by form controls.
 *
 * A validator is a function that processes a {@link Control} or collection of
 * controls and returns a map of errors. A null map means that validation has passed.
 *
 * ### Example
 *
 * ```typescript
 * var loginControl = new Control("", Validators.required)
 * ```
 */
export class Validators {
    /**
     * Validator that requires controls to have a non-empty value.
     */
    static required(control) {
        return isBlank(control.value) || (isString(control.value) && control.value == "") ?
            { "required": true } :
            null;
    }
    /**
     * Validator that requires controls to have a value of a minimum length.
     */
    static minLength(minLength) {
        return (control) => {
            if (isPresent(Validators.required(control)))
                return null;
            var v = control.value;
            return v.length < minLength ?
                { "minlength": { "requiredLength": minLength, "actualLength": v.length } } :
                null;
        };
    }
    /**
     * Validator that requires controls to have a value of a maximum length.
     */
    static maxLength(maxLength) {
        return (control) => {
            if (isPresent(Validators.required(control)))
                return null;
            var v = control.value;
            return v.length > maxLength ?
                { "maxlength": { "requiredLength": maxLength, "actualLength": v.length } } :
                null;
        };
    }
    /**
     * No-op validator.
     */
    static nullValidator(c) { return null; }
    /**
     * Compose multiple validators into a single function that returns the union
     * of the individual error maps.
     */
    static compose(validators) {
        if (isBlank(validators))
            return null;
        var presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            return _mergeErrors(_executeValidators(control, presentValidators));
        };
    }
    static composeAsync(validators) {
        if (isBlank(validators))
            return null;
        var presentValidators = validators.filter(isPresent);
        if (presentValidators.length == 0)
            return null;
        return function (control) {
            let promises = _executeValidators(control, presentValidators).map(_convertToPromise);
            return PromiseWrapper.all(promises).then(_mergeErrors);
        };
    }
}
function _convertToPromise(obj) {
    return PromiseWrapper.isPromise(obj) ? obj : ObservableWrapper.toPromise(obj);
}
function _executeValidators(control, validators) {
    return validators.map(v => v(control));
}
function _mergeErrors(arrayOfErrors) {
    var res = arrayOfErrors.reduce((res, errors) => {
        return isPresent(errors) ? StringMapWrapper.merge(res, errors) : res;
    }, {});
    return StringMapWrapper.isEmpty(res) ? null : res;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsaWRhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9jb21tb24vZm9ybXMvdmFsaWRhdG9ycy50cyJdLCJuYW1lcyI6WyJWYWxpZGF0b3JzIiwiVmFsaWRhdG9ycy5yZXF1aXJlZCIsIlZhbGlkYXRvcnMubWluTGVuZ3RoIiwiVmFsaWRhdG9ycy5tYXhMZW5ndGgiLCJWYWxpZGF0b3JzLm51bGxWYWxpZGF0b3IiLCJWYWxpZGF0b3JzLmNvbXBvc2UiLCJWYWxpZGF0b3JzLmNvbXBvc2VBc3luYyIsIl9jb252ZXJ0VG9Qcm9taXNlIiwiX2V4ZWN1dGVWYWxpZGF0b3JzIiwiX21lcmdlRXJyb3JzIl0sIm1hcHBpbmdzIjoiT0FBTyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxNQUFNLDBCQUEwQjtPQUMxRSxFQUFDLGNBQWMsRUFBQyxNQUFNLDZCQUE2QjtPQUNuRCxFQUFDLGlCQUFpQixFQUFDLE1BQU0sMkJBQTJCO09BQ3BELEVBQWMsZ0JBQWdCLEVBQUMsTUFBTSxnQ0FBZ0M7T0FDckUsRUFBQyxXQUFXLEVBQUMsTUFBTSxlQUFlO0FBSXpDOzs7Ozs7OztHQVFHO0FBQ0gsYUFBYSxhQUFhLEdBQWdCLFVBQVUsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBRXRGOzs7Ozs7O0dBT0c7QUFDSCxhQUFhLG1CQUFtQixHQUFnQixVQUFVLENBQUMsSUFBSSxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0FBRWpHOzs7Ozs7Ozs7OztHQVdHO0FBQ0g7SUFDRUE7O09BRUdBO0lBQ0hBLE9BQU9BLFFBQVFBLENBQUNBLE9BQTRCQTtRQUMxQ0MsTUFBTUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsSUFBSUEsT0FBT0EsQ0FBQ0EsS0FB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QUksUUFBUSxHQUFHLGtCQUFrQixDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBQ3JGLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUN6RCxDQUFDLENBQUNBO0lBQ0pBLENBQUNBO0FBQ0hOLENBQUNBO0FBRUQsMkJBQTJCLEdBQVE7SUFDakNPLE1BQU1BLENBQUNBLGNBQWNBLENBQUNBLFNBQVNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLGlCQUFpQkEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7QUFDaEZBLENBQUNBO0FBRUQsNEJBQTRCLE9BQW9DLEVBQUUsVUFBc0I7SUFDdEZDLE1BQU1BLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO0FBQ3pDQSxDQUFDQTtBQUVELHNCQUFzQixhQUFvQjtJQUN4Q0MsSUFBSUEsR0FBR0EsR0FBR0EsYUFBYUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsRUFBRUEsTUFBTUE7UUFDekNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLENBQUNBLEdBQUdBLGdCQUFnQkEsQ0FBQ0EsS0FBS0EsQ0FBTUEsR0FBR0EsRUFBT0EsTUFBTUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7SUFDakZBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO0lBQ1BBLE1BQU1BLENBQUNBLGdCQUFnQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsSUFBSUEsR0FBR0EsR0FBR0EsQ0FBQ0E7QUFDcERBLENBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0JsYW5rLCBpc1ByZXNlbnQsIENPTlNUX0VYUFIsIGlzU3RyaW5nfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuaW1wb3J0IHtQcm9taXNlV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9wcm9taXNlJztcbmltcG9ydCB7T2JzZXJ2YWJsZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtMaXN0V3JhcHBlciwgU3RyaW5nTWFwV3JhcHBlcn0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7T3BhcXVlVG9rZW59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuXG5pbXBvcnQgKiBhcyBtb2RlbE1vZHVsZSBmcm9tICcuL21vZGVsJztcblxuLyoqXG4gKiBQcm92aWRlcnMgZm9yIHZhbGlkYXRvcnMgdG8gYmUgdXNlZCBmb3Ige0BsaW5rIENvbnRyb2x9cyBpbiBhIGZvcm0uXG4gKlxuICogUHJvdmlkZSB0aGlzIHVzaW5nIGBtdWx0aTogdHJ1ZWAgdG8gYWRkIHZhbGlkYXRvcnMuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiB7QGV4YW1wbGUgY29yZS9mb3Jtcy90cy9uZ192YWxpZGF0b3JzL25nX3ZhbGlkYXRvcnMudHMgcmVnaW9uPSduZ192YWxpZGF0b3JzJ31cbiAqL1xuZXhwb3J0IGNvbnN0IE5HX1ZBTElEQVRPUlM6IE9wYXF1ZVRva2VuID0gQ09OU1RfRVhQUihuZXcgT3BhcXVlVG9rZW4oXCJOZ1ZhbGlkYXRvcnNcIikpO1xuXG4vKipcbiAqIFByb3ZpZGVycyBmb3IgYXN5bmNocm9ub3VzIHZhbGlkYXRvcnMgdG8gYmUgdXNlZCBmb3Ige0BsaW5rIENvbnRyb2x9c1xuICogaW4gYSBmb3JtLlxuICpcbiAqIFByb3ZpZGUgdGhpcyB1c2luZyBgbXVsdGk6IHRydWVgIHRvIGFkZCB2YWxpZGF0b3JzLlxuICpcbiAqIFNlZSB7QGxpbmsgTkdfVkFMSURBVE9SU30gZm9yIG1vcmUgZGV0YWlscy5cbiAqL1xuZXhwb3J0IGNvbnN0IE5HX0FTWU5DX1ZBTElEQVRPUlM6IE9wYXF1ZVRva2VuID0gQ09OU1RfRVhQUihuZXcgT3BhcXVlVG9rZW4oXCJOZ0FzeW5jVmFsaWRhdG9yc1wiKSk7XG5cbi8qKlxuICogUHJvdmlkZXMgYSBzZXQgb2YgdmFsaWRhdG9ycyB1c2VkIGJ5IGZvcm0gY29udHJvbHMuXG4gKlxuICogQSB2YWxpZGF0b3IgaXMgYSBmdW5jdGlvbiB0aGF0IHByb2Nlc3NlcyBhIHtAbGluayBDb250cm9sfSBvciBjb2xsZWN0aW9uIG9mXG4gKiBjb250cm9scyBhbmQgcmV0dXJucyBhIG1hcCBvZiBlcnJvcnMuIEEgbnVsbCBtYXAgbWVhbnMgdGhhdCB2YWxpZGF0aW9uIGhhcyBwYXNzZWQuXG4gKlxuICogIyMjIEV4YW1wbGVcbiAqXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiB2YXIgbG9naW5Db250cm9sID0gbmV3IENvbnRyb2woXCJcIiwgVmFsaWRhdG9ycy5yZXF1aXJlZClcbiAqIGBgYFxuICovXG5leHBvcnQgY2xhc3MgVmFsaWRhdG9ycyB7XG4gIC8qKlxuICAgKiBWYWxpZGF0b3IgdGhhdCByZXF1aXJlcyBjb250cm9scyB0byBoYXZlIGEgbm9uLWVtcHR5IHZhbHVlLlxuICAgKi9cbiAgc3RhdGljIHJlcXVpcmVkKGNvbnRyb2w6IG1vZGVsTW9kdWxlLkNvbnRyb2wpOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0ge1xuICAgIHJldHVybiBpc0JsYW5rKGNvbnRyb2wudmFsdWUpIHx8IChpc1N0cmluZyhjb250cm9sLnZhbHVlKSAmJiBjb250cm9sLnZhbHVlID09IFwiXCIpID9cbiAgICAgICAgICAgICAgIHtcInJlcXVpcmVkXCI6IHRydWV9IDpcbiAgICAgICAgICAgICAgIG51bGw7XG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdG9yIHRoYXQgcmVxdWlyZXMgY29udHJvbHMgdG8gaGF2ZSBhIHZhbHVlIG9mIGEgbWluaW11bSBsZW5ndGguXG4gICAqL1xuICBzdGF0aWMgbWluTGVuZ3RoKG1pbkxlbmd0aDogbnVtYmVyKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiAoY29udHJvbDogbW9kZWxNb2R1bGUuQ29udHJvbCk6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0+IHtcbiAgICAgIGlmIChpc1ByZXNlbnQoVmFsaWRhdG9ycy5yZXF1aXJlZChjb250cm9sKSkpIHJldHVybiBudWxsO1xuICAgICAgdmFyIHY6IHN0cmluZyA9IGNvbnRyb2wudmFsdWU7XG4gICAgICByZXR1cm4gdi5sZW5ndGggPCBtaW5MZW5ndGggP1xuICAgICAgICAgICAgICAgICB7XCJtaW5sZW5ndGhcIjoge1wicmVxdWlyZWRMZW5ndGhcIjogbWluTGVuZ3RoLCBcImFjdHVhbExlbmd0aFwiOiB2Lmxlbmd0aH19IDpcbiAgICAgICAgICAgICAgICAgbnVsbDtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRvciB0aGF0IHJlcXVpcmVzIGNvbnRyb2xzIHRvIGhhdmUgYSB2YWx1ZSBvZiBhIG1heGltdW0gbGVuZ3RoLlxuICAgKi9cbiAgc3RhdGljIG1heExlbmd0aChtYXhMZW5ndGg6IG51bWJlcik6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gKGNvbnRyb2w6IG1vZGVsTW9kdWxlLkNvbnRyb2wpOiB7W2tleTogc3RyaW5nXTogYW55fSA9PiB7XG4gICAgICBpZiAoaXNQcmVzZW50KFZhbGlkYXRvcnMucmVxdWlyZWQoY29udHJvbCkpKSByZXR1cm4gbnVsbDtcbiAgICAgIHZhciB2OiBzdHJpbmcgPSBjb250cm9sLnZhbHVlO1xuICAgICAgcmV0dXJuIHYubGVuZ3RoID4gbWF4TGVuZ3RoID9cbiAgICAgICAgICAgICAgICAge1wibWF4bGVuZ3RoXCI6IHtcInJlcXVpcmVkTGVuZ3RoXCI6IG1heExlbmd0aCwgXCJhY3R1YWxMZW5ndGhcIjogdi5sZW5ndGh9fSA6XG4gICAgICAgICAgICAgICAgIG51bGw7XG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBOby1vcCB2YWxpZGF0b3IuXG4gICAqL1xuICBzdGF0aWMgbnVsbFZhbGlkYXRvcihjOiBhbnkpOiB7W2tleTogc3RyaW5nXTogYm9vbGVhbn0geyByZXR1cm4gbnVsbDsgfVxuXG4gIC8qKlxuICAgKiBDb21wb3NlIG11bHRpcGxlIHZhbGlkYXRvcnMgaW50byBhIHNpbmdsZSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHVuaW9uXG4gICAqIG9mIHRoZSBpbmRpdmlkdWFsIGVycm9yIG1hcHMuXG4gICAqL1xuICBzdGF0aWMgY29tcG9zZSh2YWxpZGF0b3JzOiBGdW5jdGlvbltdKTogRnVuY3Rpb24ge1xuICAgIGlmIChpc0JsYW5rKHZhbGlkYXRvcnMpKSByZXR1cm4gbnVsbDtcbiAgICB2YXIgcHJlc2VudFZhbGlkYXRvcnMgPSB2YWxpZGF0b3JzLmZpbHRlcihpc1ByZXNlbnQpO1xuICAgIGlmIChwcmVzZW50VmFsaWRhdG9ycy5sZW5ndGggPT0gMCkgcmV0dXJuIG51bGw7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24oY29udHJvbDogbW9kZWxNb2R1bGUuQWJzdHJhY3RDb250cm9sKSB7XG4gICAgICByZXR1cm4gX21lcmdlRXJyb3JzKF9leGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCBwcmVzZW50VmFsaWRhdG9ycykpO1xuICAgIH07XG4gIH1cblxuICBzdGF0aWMgY29tcG9zZUFzeW5jKHZhbGlkYXRvcnM6IEZ1bmN0aW9uW10pOiBGdW5jdGlvbiB7XG4gICAgaWYgKGlzQmxhbmsodmFsaWRhdG9ycykpIHJldHVybiBudWxsO1xuICAgIHZhciBwcmVzZW50VmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuZmlsdGVyKGlzUHJlc2VudCk7XG4gICAgaWYgKHByZXNlbnRWYWxpZGF0b3JzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcblxuICAgIHJldHVybiBmdW5jdGlvbihjb250cm9sOiBtb2RlbE1vZHVsZS5BYnN0cmFjdENvbnRyb2wpIHtcbiAgICAgIGxldCBwcm9taXNlcyA9IF9leGVjdXRlVmFsaWRhdG9ycyhjb250cm9sLCBwcmVzZW50VmFsaWRhdG9ycykubWFwKF9jb252ZXJ0VG9Qcm9taXNlKTtcbiAgICAgIHJldHVybiBQcm9taXNlV3JhcHBlci5hbGwocHJvbWlzZXMpLnRoZW4oX21lcmdlRXJyb3JzKTtcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIF9jb252ZXJ0VG9Qcm9taXNlKG9iajogYW55KTogYW55IHtcbiAgcmV0dXJuIFByb21pc2VXcmFwcGVyLmlzUHJvbWlzZShvYmopID8gb2JqIDogT2JzZXJ2YWJsZVdyYXBwZXIudG9Qcm9taXNlKG9iaik7XG59XG5cbmZ1bmN0aW9uIF9leGVjdXRlVmFsaWRhdG9ycyhjb250cm9sOiBtb2RlbE1vZHVsZS5BYnN0cmFjdENvbnRyb2wsIHZhbGlkYXRvcnM6IEZ1bmN0aW9uW10pOiBhbnlbXSB7XG4gIHJldHVybiB2YWxpZGF0b3JzLm1hcCh2ID0+IHYoY29udHJvbCkpO1xufVxuXG5mdW5jdGlvbiBfbWVyZ2VFcnJvcnMoYXJyYXlPZkVycm9yczogYW55W10pOiB7W2tleTogc3RyaW5nXTogYW55fSB7XG4gIHZhciByZXMgPSBhcnJheU9mRXJyb3JzLnJlZHVjZSgocmVzLCBlcnJvcnMpID0+IHtcbiAgICByZXR1cm4gaXNQcmVzZW50KGVycm9ycykgPyBTdHJpbmdNYXBXcmFwcGVyLm1lcmdlKDxhbnk+cmVzLCA8YW55PmVycm9ycykgOiByZXM7XG4gIH0sIHt9KTtcbiAgcmV0dXJuIFN0cmluZ01hcFdyYXBwZXIuaXNFbXB0eShyZXMpID8gbnVsbCA6IHJlcztcbn1cbiJdfQ==